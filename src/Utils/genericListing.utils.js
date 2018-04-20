
/**
 * Returns meta data about menus to be used to fetch actual listing data
 * This method is invoked, Once menu detail is fetched 
 * @param  {object} menuDetail
 */
export function ConvertMenuDetailForGenericListing(menuDetail) {
    if (menuDetail.default_order) {
        var splits = menuDetail.default_order.split(",");
    }

    /**
     * Preparing obj to build template
     */
    return {
        includes: menuDetail.includes,
        url: menuDetail.base_url,
        starter: menuDetail.starter,
        restricted_query: menuDetail.restricted_query,
        restrictColumnFilter: menuDetail.restricted_column,
        userMethod: menuDetail.method,
        formPreferenceName: menuDetail.state_name.toLowerCase(),
        order: menuDetail.default_order ? splits[0].trim() : "id",
        sort: menuDetail.default_order ? splits[1].trim() : "desc",
        menuId: menuDetail.id,
        model: menuDetail.data_model,
        preference: menuDetail.preference,
        listName: menuDetail.state_name.toLowerCase(),
        nextActions: menuDetail.actions,
        userFilter: menuDetail.user_filter,
        pageName: menuDetail.name,
        image: menuDetail.image,
        // module: menuDetail.base_url,
        // actions: menuDetail.actions,
        // method: menuDetail.method,
        // search: menuDetail.search,
        // scripts: menuDetail.scripts,
        // stateName: menuDetail.state_name
    };
}