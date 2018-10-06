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

    clone() {
        return new CallFunc(this._callback, this._context, this._data);
    }
}

export default CallFunc;