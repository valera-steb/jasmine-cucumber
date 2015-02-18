/**
 * Created by steb on 18.02.2015.
 */
define({
    extract: function (item, field, default_) {
        return (item && item[field])
            ? item[field]
            : default_;
    }
});