/**
 * Contains all regex being used in the project
 */

export const MATCH_PARENT_PATH = /`(.*?)`+./g;
export const MATCH_WHITESPACE = / /g;
export const MATCH_START_END_PARANTHESIS = /(^\()|(\)$)/g; // (test(class)test) => test(class)test
export const PICK_AFTER_LAST_DOTS = /[^\.]+$/; // `vehicle`.id = id
export const STRING_WITHIN_TILDE = /(?<=\`).*(?=\`)/g;  // `vehicle`.id = vehicle



