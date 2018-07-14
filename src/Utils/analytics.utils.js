import io from 'socket.io-client';
import { GetUser } from './../Utils/user.utils';
import { TrackEvent } from './../Utils/http.utils';
import moment from 'moment';
import { GetCookie, SetCookie } from './../Utils/cookie.utils';

let socket = io("https://analytics.justride.in");
let s4;

export default class AnalyticsUtil {
    static RegisterEvent(event, event_data) {
        if (event_data.page_url.includes("ad.justride.in")) {//enable only for ad.justride.in
            let loggedinUser = GetUser();

            let param = {
                event_data: {}
            };

            if (loggedinUser) {
                param.event_data.user_id = loggedinUser.id;
            }
            param.event_data.identifier = this.getIdentifier();
            param.event_data.platform_id = 20;
            param.event_data.received_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            if (loggedinUser) {
                param.event_data.user_id = loggedinUser.id;
            }

            if (event) {
                param.event_name = event;
            }
            if (event_data) {
                // angular.extend(param.event_data, event_data);
            }

            if (socket.connected) {//if socket connected 
                socket.emit("ua-request", param);
            }
            else {
                TrackEvent(param);
            }
        }


        this.getIdentifier = () => {
            let cookie = GetCookie("ua_tracking_cookie");
            if (cookie) {
                return GetCookie("ua_tracking_cookie");
            } else {
                let value = this.getCookieValue();
                //set cookie used for user analytics tracking
                SetCookie("ua_tracking_cookie", value, 3000);
                return GetCookie("ua_tracking_cookie");
            }
        }

        this.getCookieValue = () => {
            return s4() + s4() + s4() + s4();
        }

        s4 = () => {
            Math.floor((1 + Math.random()) * 0x1000000)
                .toString(16)
                .substring(1);
        }
    }
}
