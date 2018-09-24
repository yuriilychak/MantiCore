import Repository from "repository/Repository";

/**
 * @desc Singleton object serves as an object cache pool.<br>
 *     It can helps you to improve your game performance for objects which need frequent release and recreate operations.
 * @namespace pool
 * @memberOf MANTICORE
 */

const pool = {

    /**
     * @desc Pool repository
     * @type {MANTICORE.repository.Repository}
     * @memberOf MANTICORE.pool
     * @private
     */

    _pool: new Repository(),

    /**
     * @desc Variable for generate pool id's.
     * @type {int}
     * @memberOf MANTICORE.pool
     * @private
     */
    _id: 0,

    /**
     * @desc Returns PID of object
     * @function
     * @memberOf MANTICORE.pool
     * @private
     * @param {Object} objectClass
     * @returns {int}
     */

    _getPID: function(objectClass) {
        let result;
        const poolIdKey = "__pid";

        if (!objectClass.prototype.hasOwnProperty(poolIdKey)) {
            result = ++this._id;
            Object.defineProperty(
                objectClass.prototype,
                poolIdKey,
                {
                    writable: true,
                    enumerable: false,
                    configurable: true,
                    value: result
                });
            return result;
        }

        return objectClass.prototype[poolIdKey];
    },

    /**
     * @desc Destroy all elements by key.
     * @function
     * @memberOf MANTICORE.pool
     * @private
     * @param {int} id
     */

    _destroyElements: function(id) {
        const elements = this._pool.getElement(id);
        if (!elements[0].destroy) {
            return;
        }
        const elementCount = elements.length;
        for (let i = 0; i < elementCount; ++i) {
            elements[i].destroy();
        }
    },

    /**
     * @desc Put object in pool.
     * @function
     * @memberOf MANTICORE.pool
     * @param {Object} object
     */

    putObject: function (object) {
        const pid = this._getPID(object.constructor);
        let elements;

        if (!this._pool.hasElement(pid)) {
            elements = [];
            this._pool.addElement(elements, pid);
        }
        else {
            elements = this._pool.getElement(pid);
        }

        if (!object.inPool) {
            object.inPool = true;
        }

        if (object.disuse) {
            object.disuse();
        }

        elements.push(object);
    },

    /**
     * @desc Check if this kind of object has already in pool.
     * @function
     * @memberOf MANTICORE.pool
     * @param {Object} objectClass
     * @returns {boolean} if this kind of obj is already in pool return true,else return false;
     */

    hasObject: function(objectClass) {
        const pid = this._getPID(objectClass);
        if (!this._pool.hasElement(pid)) {
            return false;
        }
        const elements = this._pool.getElement(pid);
        return elements.length !== 0;
    },

    /**
     * @desc Remove the obj if you want to delete it.
     * @function
     * @memberOf MANTICORE.pool
     * @param {Object} object
     */
    removeObject: function (object) {
        const pid = this._getPID(object.constructor);
        this._destroyElements(pid);
        this._pool.removeElement(pid);
    },

    /**
     * @desc Get object from pool.
     * @function
     * @memberOf MANTICORE.pool
     * @param {...*} var_args
     */
    getObject: function (var_args) {
        const arrayArgs = Array.from(arguments);
        const [objectClass, ...reuseArguments] = arrayArgs;

        if (!this.hasObject(objectClass)) {
            return new objectClass(...reuseArguments);
        }

        const pid = this._getPID(objectClass);
        const elements = this._pool.getElement(pid);
        const object = elements.pop();

        if (object.reuse && reuseArguments.length !== 0) {
            object.reuse(...reuseArguments);
        }
        return object;
    },

    /**
     * @desc Remove all objects from pool and reset it.
     * @function
     * @memberOf MANTICORE.pool
     */

    drain: function () {
        const keys = this._pool.keys;
        const keyCount = keys.length;

        for (let i = 0; i < keyCount; ++i) {
            this._destroyElements(keys[i]);
        }

        this._pool.clear();
    }
};

export default pool;