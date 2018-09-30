/**
 * @desc Middlewares for load end generate bundles.
 * @namespace middleware
 * @memberOf MANTICORE.bundle
 */

const middleware = {
    bundleParser: function() {
        return (resource, next) => {
            console.log(resource);
            next();
        }
    }
};

export default middleware;