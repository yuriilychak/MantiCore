import ActionInstant from "./ActionInstant";
import Type from "util/Type";

/**
 * @desc Call callback.
 * @class
 * @extends MANTICORE.animation.action.ActionInstant
 * @memberOf MANTICORE.animation.action
 */

class CallFunc extends ActionInstant {

    /**
     * @constructor
	 * @param {MANTICORE.animation.callback.CallFuncExecute} callback
	 * @param {object} [context = null]
	 * @param {*} [data=null] - Data for function, it accepts all data types.
	 */
    constructor(callback, context = null, data = null){
        super();
        /**
         * @type {Object}
         * @private
         */
        this._context = context;
        /**
         * @type {MANTICORE.animation.callback.CallFuncExecute}
         * @private
         */
        this._callback = callback;
        /**
         * @type {*}
         * @private
         */
        this._data = data;
    }

    /**
     * PUBLIC METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Execute callback.
     * @method
     * @public
     */
    execute() {
        if (!Type.isNull(this._callback)) {
            return;
        }
        this._callback.call(this._context, this.target, this._data);
    }

    update(dt) {
        this.execute();
    }

    /**
     * @desc Need to copy object with deep copy. Returns a clone of action.
     * @method
     * @public
     * @return {MANTICORE.animation.action.CallFunc}
     */

    clone() {
        return CallFunc.create(this._callback, this._context, this._data);
    }

    /**
     * @desc Calls by pool when object get from pool. Don't call it only override.
     * @method
     * @public
     * @param {MANTICORE.animation.callback.CallFuncExecute} callback
     * @param {object} [context = null]
     * @param {*} [data=null] - Data for function, it accepts all data types.
     */

    reuse(callback, context = null, data = null) {
        super.reuse();
        this._context = context;
        this._callback = callback;
        this._data = data;
    }

    /**
     * PROTECTED METHODS
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Clear data befor disuse and destroy.
     * @method
     * @protected
     */

    clearData() {
        this._context = null;
        this._callback = null;
        this._data = null;
        super.clearData();
    }

    /**
     * PROPERTIES
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @desc Get selectorTarget.
     * @public
     * @return {object}
     */
    get context() {
        return this._context;
    }

    set context(value) {
        if (this._context === value) {
            return
        }
        this._context = value;
    }
}

export default CallFunc;