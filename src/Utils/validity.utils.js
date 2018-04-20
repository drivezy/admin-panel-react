/***************************************************
 * Generic validation for all kind of input types
 **************************************************/
export default class validity {
        /**
         * Check method is main PoC to use generic validation method
         * @param  {object} obj - contains type[array or string], value, anytrue[boolean]
         * type defines type of value to be validated, value of that type, anytrue is used to return true incase of any of rule is matched among given array of types
         */
        static check(obj) {
            const { type, value, anyTrue } = obj;
            const required = obj.required == false ? obj.required : true;
            if ((!type || !value) && required) {
                return { success: false, error: 'This field can\'t be left blank' };
            }
            const types = Array.isArray(type) ? type : [type];
    
            /* eslint-disable */
            for (var i in types) {
                const validityObj = newValidity.checkValidity(types[i]);
    
                const result = validityObj.exp.test(value);
                if (anyTrue) {
                    if (result) {
                        return { success: true, type: types[i] };
                    } else if (i == types.length) {
                        return { success: false, error: validityObj.error, type: types[i] };
                    }
                } else if (result) {
                    return { success: true, error: validityObj.error, type: types[i] };
                } else { // false result
                    return { success: false, error: validityObj.error, type: types[i] };
                }
    
            }
    
            return { success: false };
            /* eslint-enable */
        }
    
        /**
         * Maps regex with respect to given type
         * @param  {string} type
         */
        checkValidity(type) {
            let exp;
            let error;
    
            switch (type) {
                /* eslint-disable */
                case 'email':
                    exp = (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                    error = 'Not a valid email';
                    break;
    
                case 'number':
                    exp = (/^(\-)?([\d]+(?:\.\d{1,3})?)$/);
                    error = 'Not a valid number';
                    break;
    
                case 'mobile':
                    exp = (/^[0-9]{10}$/);
                    error = 'Not a valid mobile number';
                    break;
    
                case 'text':
                    exp = (/^[a-zA-Z ]*$/);
                    error = 'Not a valid text';
                    break;
    
                case 'ifsc':
                    exp = (/^[A-Z]{4}\d{1}[A-Za-z0-9]{6}$/);
                    error = 'Not a valid IFSC';
                    break;
    
                case 'datetime':
                    exp = (/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/);
                    error = 'Not a valid date time';
                    break;
    
                case 'date':
                    exp = (/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/);
                    error = 'Not a valid date';
                    break;
    
                case 'otp':
                    exp = (/^\d{4}$/);
                    error = 'Not a valid OTP';
                    break;
    
                case 'fuel':
                    exp = (/^0*([1-9][0-9]?$|^100)$/);
                    error = 'Not a valid fuel percentage';
                    break;
    
                case 'otp6':
                    exp = (/^\d{6}$/);
                    error = 'Not a valid OTP';
                    break;
    
                case 'required':
                    exp = (/^[\s\t\r\n]*\S+/);
                    error = 'This field is required';
                    break;
    
                case 'aadhar':
                    exp = (/^\d{12}$/);
                    error = 'Not a valid aadhar number';
    
                default:
                    break;
                /* eslint-enable */
            }
            return { exp, error };
        }
    }
    
    const newValidity = new validity();
    