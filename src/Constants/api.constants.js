
/*
 * Contains all server and firebase(if any) endpoints
 */

/** Public routes goes here */
export const FetchCities = 'city';
export const OpenPropertiesEndPoint = 'property';
export const LoginCheckEndPoint = 'getUserSessionDetails';
export const LoginEndPoint = 'login'; // login end point
export const SignupEndPoint = 'user'; // signup and 
/** Public routes ends here */

/** Private routes goes here */
// export const GetMenusEndPoint = 'getMenus';
export const GetMenusEndPoint = 'menus';
export const GetMenuDetailEndPoint = 'menuDetails/';

export const MenuFilterEndPoint = 'menuFilter';

export const ListPreference = 'listPreference';
export const FormPreferenceEndPoint = 'formPreference';

export const FormDetailEndPoint = 'formDetails';

export const SecurityRuleEndPoint = 'api/record/securityRule/';
export const ClientScriptEndPoint = 'api/record/clientScript/';
export const ColumnsEndPoint = 'api/record/column';
/** Private routes ends here */