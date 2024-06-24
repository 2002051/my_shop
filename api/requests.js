// 网络请求
// 验证jwt 
export function ValidateCode(data = {}) {
	return request({
		url: "api/validate/token/",
		method: "POST",
		data:data
	})
}


export function apiLogin(data = {}) {
	
	return request({
		url: "api/login/",
		method: "POST",
		data:data
	})
}

export function apiGetCodeImg(data = {}) {
	
	return request({
		url: "api/codeimg/",
		method: "GET",
		data:data
	})
}

export function apiSendSms(data = {}) {
	
	return request({
		url: "api/sms/",
		method: "POST",
		data:data
	})
}

export function apiDoRegist(data = {}) {
	
	return request({
		url: "api/regist/",
		method: "POST",
		data:data
	})
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 基础网络请求
let BaseUrl = "http://127.0.0.1:8000/"

function request(config = {}) {
	let {
		method='GET',
		url,
		data= {},
		header= {}
	} = config;
	let URL = BaseUrl + url;
	return new Promise((resolve, reject) => {
		uni.request({
			url: URL,
			method: method,
			header: header,
			data: data,
			success: (res) => {
				if (res.data.code === 0) {
					resolve(res.data)
				} else if(res.data.code === -2) {
					// uni.showModal({
					// 	title: "错误",
					// 	content: res.data.detail,
					// 	showCancel: false
					// });
					reject(res.data); 
				}else if(res.data.code === -1){
					reject(res.data);
				}
			},
			fail: (err) => {
				reject(err) 
			}
		})
	})


}


// // 网络请求
// export function apiSendSms(data = {}) {
//     return request({
//         url: "api/sms",
//         method: "POST",
//         data: data
//     });
// }

// // 基础网络请求
// let BaseUrl = "http://127.0.0.1:8000/";

// function request(config = {}) {
//     let {
//         method = 'GET',
//         url,
//         data = {},
//         header = {}
//     } = config;
//     let URL = BaseUrl + url;
//     return new Promise((resolve, reject) => {
//         uni.request({
//             url: URL,
//             method: method,
//             header: header,
//             data: data,
//             success: (res) => {
//                 if (res.data.code === 0) {
//                     resolve(res.data);
//                 } else {
//                     uni.showModal({
//                         title: "错误",
//                         content: res.data.detail,
//                         showCancel: false
//                     });
//                     reject(res.data); // 以失败态抛出错误信息
//                 }
//             },
//             fail: (err) => {
//                 reject(err); // 失败的话执行reject 动作，那么这个promise 对象的状态就是rejected(已失败)
//             }
//         });
//     });
// }