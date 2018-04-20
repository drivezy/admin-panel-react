import Toast from './../Utils/toast.utils';
import Validity from './../Utils/validity.utils';
import { Get, Post } from './../Utils/http.utils';
import { GenerateLoginOTP } from './../Constants/api.constants';
import { LoginEndPoint, SignupEndPoint, ValidateLoginOTP } from './../Constants/api.constants';

import { LoginCheck } from './../Actions/user.action';
import Store from './../index.store';

export async function CheckUsername({ username, history }) {
    const userNameValid = Validity.check({ type: ['mobile', 'email'], value: username, anyTrue: true });
    let message = '';
    if (!userNameValid.success) {
        Toast.error('Username is not valid');
        return;
    }
    const result = await Post({ url: GenerateLoginOTP, body: { username }, hideMessage: true });
    switch (result.response) {
        case 'valid email id': // user exists, login flow
            return 1;

        case 'OTP sent successfully': // mobile flow
            // navigate to otp page
            // Actions.OTP({ mobile: username, nextAction: this.props.nextAction, slot: this.props.slot, endpoint: ValidateLoginOTP, resendOTP: this.resendOTP });

            return 3;

        case 'invalid email id': // signup flow
            // navigate to signup flow
            return 2;

        case 'too many attempts':
            message = 'Too many attempts';
            break;

        default:
            message = result.response;
            break;
    }

    Toast.error(message);
}

/**
* Function to login 
* @param  {string} username
* @param  {string} password
*/
export async function Login(username, password, history, nextScene) {
    const userNameValid = Validity.check({ type: ['mobile', 'email'], value: username, anyTrue: true });
    const passwordValid = Validity.check({ type: ['required'], value: password, anyTrue: true });
    if (!userNameValid.success || !passwordValid.success) {
        const message = !userNameValid.success ? 'Username is not valid' : 'Password cant be left blank';
        Toast.error(message);
        return;
    }
    const result = await Post({ url: LoginEndPoint, body: { username, password } });

    /**
     * Has to handle manually respose
     * result.response is not available
     * result.reason is available
     */
    if (result.success) {
        history.push(nextScene ? nextScene : '/');
        Store.dispatch(LoginCheck()); // triggers LoginCheck action
    }
}

/**
* Sign up method
* @param  {string} name
* @param  {string} email
* @param  {string} mobile
* @param  {string} password
* @param  {string} rePassword
* @param  {Object} history - history object to navigate to next scene on successful Otp submission
*/
export async function Register(name, email, password, rePassword, history) {
    const context = this;
    const nameValid = Validity.check({ type: ['text'], value: name, anyTrue: true });
    const emailValid = Validity.check({ type: ['email'], value: email, anyTrue: true });
    const passwordValid = Validity.check({ type: ['required'], value: password, anyTrue: true });
    if (password != rePassword) {
        Toast.error('password doesn\'t match');
        return;
    }
    if (!(nameValid.success && emailValid.success && passwordValid.success)) {
        // if Name is not valid, show name error, else if email is not valid, show mail error, else show password error
        const message = !nameValid.success ? 'Please fill valid name' : (!emailValid.success ? 'Please fill valid email' : 'Please enter Password');
        Toast.error(message);
        return;
    }

    const result = await Post({ url: SignupEndPoint, body: { name, email, password } });
    if (result.success) {
        NavigateToNextScene(history);
    } else if (result.reason && typeof result.reason == 'string') {
        /**
        * result.reason is their insted of result.response
        */
        Toast.error(result.reason);
    }
}

/**
 * Final OTP submission method. Takes OTP and mobile number to validate
 * @param  {number} mobile - mobile number
 * @param  {Object} history - history object to navigate to next scene on successful Otp submission
 * @param  {number} otp - OTP
 * @param  {string} nextScene -(optional) next scene path to be redirected after successfully Otp validation
 * @param  {string} method -(optional) Http call method name - Get or Post
 * @param  {strinf} endpoint -(optional) Url endpoint to hit
 */
export async function OnOtpSubmit({ method, endpoint, mobile, history, otp, nextScene }) {
    method = method || 'Post';
    const methods = {};
    methods.Get = Get;
    methods.Post = Post;
    const token = otp;
    const otpValidity = Validity.check({ type: 'otp', value: token });
    if (!otpValidity.success) {
        Toast.error(otpValidity.error);
    }
    endpoint = endpoint || ValidateLoginOTP;
    const paramsDetail = {
        url: endpoint
    };

    if (method == 'get') {
        paramsDetail.url += token;
    } else {
        paramsDetail.body = {
            token,
            mobile: mobile
        };
    }
    const result = await methods[method](paramsDetail);
    if (result.success) {
        if (endpoint == ValidateLoginOTP) { // if login flow
            Store.dispatch(LoginCheck()); // triggers LoginCheck action
        }
        NavigateToNextScene(history, nextScene);
    }

    // @TODO process the OTP apis.
}

/**
 * Function to resend OTP
 */
export async function ResendOTP(username) {
    await Post({ url: GenerateLoginOTP, body: { username } });
}

function NavigateToNextScene(history, nextScene) {
    history.push(nextScene ? nextScene : '/');
}