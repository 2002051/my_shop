if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_LOAD = "onLoad";
  const ON_READY = "onReady";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  const onReady = /* @__PURE__ */ createHook(ON_READY);
  function ValidateCode(data = {}) {
    return request({
      url: "api/validate/token/",
      method: "POST",
      data
    });
  }
  function apiLogin(data = {}) {
    return request({
      url: "api/login/",
      method: "POST",
      data
    });
  }
  function apiGetCodeImg(data = {}) {
    return request({
      url: "api/codeimg/",
      method: "GET",
      data
    });
  }
  function apiSendSms(data = {}) {
    return request({
      url: "api/sms/",
      method: "POST",
      data
    });
  }
  function apiDoRegist(data = {}) {
    return request({
      url: "api/regist/",
      method: "POST",
      data
    });
  }
  let BaseUrl = "http://192.168.0.102:8000/";
  function request(config = {}) {
    let {
      method = "GET",
      url,
      data = {},
      header = {}
    } = config;
    let URL = BaseUrl + url;
    return new Promise((resolve, reject) => {
      uni.request({
        url: URL,
        method,
        header,
        data,
        success: (res) => {
          if (res.data.code === 0) {
            resolve(res.data);
          } else if (res.data.code === -2) {
            reject(res.data);
          } else if (res.data.code === -1) {
            reject(res.data);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$8 = {
    __name: "login",
    setup(__props) {
      const loginForm = vue.ref({
        username: "",
        password: "",
        code: ""
      });
      const registForm = vue.ref({
        username: "",
        password: "",
        phone: "",
        code: ""
      });
      const isRegist = vue.ref(false);
      const count = vue.ref(60);
      const isSending = vue.ref(false);
      const base64_str = vue.ref("");
      function doChangeImg() {
        getCodeImg();
      }
      onLoad((e) => {
        formatAppLog("log", "at pages/login/login.vue:101", "页面加载");
        getCodeImg();
      });
      async function getCodeImg() {
        await apiGetCodeImg().then((res) => {
          base64_str.value = res.data;
        }).catch((err) => {
          formatAppLog("log", "at pages/login/login.vue:109", "2", err);
        });
      }
      async function login() {
        await apiLogin({
          ...loginForm.value
        }).then((res) => {
          formatAppLog("log", "at pages/login/login.vue:118", res, "ssss");
          uni.setStorage({
            key: "token",
            data: res.data,
            success: (X) => {
              formatAppLog("log", "at pages/login/login.vue:124", "token saved!");
              uni.switchTab({
                url: "/pages/index/index"
              });
            }
          });
        }).catch((err) => {
          uni.showToast({
            title: err.detail,
            icon: "none"
          });
        });
        return 0;
      }
      function changeRegist() {
        isRegist.value = !isRegist.value;
      }
      async function doSendSms() {
        await apiSendSms({
          "phone": registForm.value.phone
        }).then((res) => {
          formatAppLog("log", "at pages/login/login.vue:158", "res1", res);
          uni.showToast({
            title: res.data,
            icon: "none"
          });
          isSending.value = true;
          let v1 = setInterval(function() {
            count.value -= 1;
            if (count.value <= 0) {
              count.value = 60;
              clearInterval(v1);
              isSending.value = false;
            }
          }, 1e3);
        }).catch((err) => {
          uni.showToast({
            title: err.detail,
            icon: "error"
          });
          formatAppLog("log", "at pages/login/login.vue:177", "err", err);
        }).finally((res) => {
          formatAppLog("log", "at pages/login/login.vue:179", "finally", res);
        });
      }
      async function doRegist() {
        formatAppLog("log", "at pages/login/login.vue:185", "sss", registForm.value);
        await apiDoRegist({
          ...registForm.value
          // "username": registForm.username,
          // "password": registForm.password,
          // "phone": registForm.phone,
          // "code": registForm.code
        }).then((res) => {
          uni.showToast({
            title: res.data,
            icon: "success"
          });
          formatAppLog("log", "at pages/login/login.vue:198", "res", res);
        }).catch((err) => {
          if (typeof err.detail === "object") {
            formatAppLog("log", "at pages/login/login.vue:201", "请全部填好");
            uni.showToast({
              title: "请全部填好",
              icon: "error"
            });
          } else if (typeof err.detail === "string") {
            uni.showToast({
              title: err.detail,
              icon: "error"
            });
          }
          formatAppLog("log", "at pages/login/login.vue:212", "err", err);
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
          !isRegist.value ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "box"
          }, [
            vue.createElementVNode("view", { class: "logo" }, " 用户登录 "),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => loginForm.value.username = $event),
                  placeholder: "用户名",
                  class: "input-control"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, loginForm.value.username]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "password",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => loginForm.value.password = $event),
                  placeholder: "密码",
                  class: "input-control"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, loginForm.value.password]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  style: { "width": "300rpx", "display": "inline-block" },
                  type: "text",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => loginForm.value.code = $event),
                  placeholder: "图片验证码",
                  class: "input-control"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, loginForm.value.code]
              ]),
              vue.createElementVNode("image", {
                onClick: doChangeImg,
                style: { "width": "300rpx", "height": "100rpx", "bottom": "15rpx" },
                src: `data:image/jpeg;base64,` + base64_str.value,
                mode: "widthFix"
              }, [
                vue.createCommentVNode(' 				<image style="width: 300rpx;height: 100rpx;bottom: 15rpx;" src="/static/code.jpg" mode="aspectFill"> ')
              ], 8, ["src"]),
              vue.createCommentVNode(' <button style="display: inline-block;" class="btn">发送验证码</button> ')
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("button", {
                onClick: login,
                class: "login-button"
              }, "登录")
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("view", {
                class: "",
                onClick: changeRegist
              }, " 没有账号？点击注册 ")
            ])
          ])) : vue.createCommentVNode("v-if", true),
          isRegist.value ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "box"
          }, [
            vue.createElementVNode("view", { class: "logo" }, " 注册 "),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "text",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => registForm.value.username = $event),
                  placeholder: "用户名",
                  class: "input-control"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, registForm.value.username]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "password",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => registForm.value.password = $event),
                  placeholder: "密码",
                  class: "input-control"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, registForm.value.password]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "text",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => registForm.value.phone = $event),
                  placeholder: "手机号",
                  class: "input-control"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, registForm.value.phone]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  style: { "width": "300rpx", "display": "inline-block" },
                  type: "text",
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => registForm.value.code = $event),
                  placeholder: "验证码",
                  class: "input-control"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, registForm.value.code]
              ]),
              !isSending.value ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                style: { "display": "inline-block" },
                class: "btn",
                onClick: doSendSms
              }, "发送验证码")) : vue.createCommentVNode("v-if", true),
              isSending.value ? (vue.openBlock(), vue.createElementBlock(
                "button",
                {
                  key: 1,
                  style: { "display": "inline-block" },
                  class: "btn",
                  disabled: ""
                },
                vue.toDisplayString(count.value) + "后重新发送",
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("button", {
                onClick: doRegist,
                class: "login-button"
              }, "点击注册")
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("view", {
                class: "",
                onClick: changeRegist
              }, " 没有账号？点击注册 ")
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ]);
      };
    }
  };
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-e4e4508d"], ["__file", "E:/uniapp_learning/demo1/p2/pages/login/login.vue"]]);
  const _sfc_main$7 = {};
  function _sfc_render$4(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "box" }, [
      vue.createElementVNode("view", { class: "image" }, " 1 "),
      vue.createElementVNode("view", { class: "detail" }, [
        vue.createElementVNode("view", { class: "title" }),
        vue.createElementVNode("view", { class: "price" })
      ])
    ]);
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$4], ["__file", "E:/uniapp_learning/demo1/p2/components/goods/goods.vue"]]);
  const _sfc_main$6 = {};
  function _sfc_render$3(_ctx, _cache) {
    const _component_goods = resolveEasycom(vue.resolveDynamicComponent("goods"), __easycom_0$1);
    return vue.openBlock(), vue.createBlock(_component_goods);
  }
  const PagesListList = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$3], ["__file", "E:/uniapp_learning/demo1/p2/pages/list/list.vue"]]);
  const _sfc_main$5 = {};
  function _sfc_render$2(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "box" }, [
      vue.createElementVNode("view", { class: "title" }, " 标题1 "),
      vue.createElementVNode("view", { class: "list" }, [
        (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(4, (item) => {
            return vue.createElementVNode("view", { class: "item" }, [
              vue.createElementVNode("view", { class: "img" }, [
                vue.createElementVNode("image", {
                  src: "/static/link01.png",
                  mode: "scaleToFill"
                })
              ]),
              vue.createElementVNode(
                "view",
                { class: "text" },
                " 交友论坛" + vue.toDisplayString(item),
                1
                /* TEXT */
              )
            ]);
          }),
          64
          /* STABLE_FRAGMENT */
        ))
      ])
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$2], ["__scopeId", "data-v-d61422cb"], ["__file", "E:/uniapp_learning/demo1/p2/components/articlelist/articlelist.vue"]]);
  const _imports_0 = "/assets/2.c8e4eb30.jpg";
  const _sfc_main$4 = {
    __name: "index",
    setup(__props) {
      const token = vue.ref("");
      const cartlist = vue.ref([{
        title: "最新文章",
        img: "../../static/tabbar/1.png"
      }, {
        title: "相册",
        img: "../../static/tabbar/2.png"
      }, {
        title: "网课",
        img: "../../static/tabbar/3.png"
      }]);
      onReady((x) => {
        token.value = uni.getStorageSync("token");
        DoValidateCode();
      });
      async function DoValidateCode() {
        await ValidateCode({
          token: token.value
        }).then((res) => {
          formatAppLog("log", "at pages/index/index.vue:80", "res", res);
        }).catch((err) => {
          uni.showToast({
            title: err.detail,
            icon: "none"
          });
          uni.redirectTo({
            url: "/pages/login/login"
          });
        });
      }
      return (_ctx, _cache) => {
        const _component_articlelist = resolveEasycom(vue.resolveDynamicComponent("articlelist"), __easycom_0);
        return vue.openBlock(), vue.createElementBlock("view", { class: "body" }, [
          vue.createElementVNode("view", { class: "notices" }, [
            vue.createElementVNode("view", { class: "text" }, " 123 ")
          ]),
          vue.createElementVNode("view", { class: "swpierBox" }, [
            vue.createElementVNode("swiper", null, [
              vue.createElementVNode("swiper-item", null, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  mode: "aspectFit"
                })
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "cartList" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(cartlist.value, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", { class: "cartItem" }, [
                  vue.createElementVNode("image", {
                    src: item.img,
                    mode: "aspectFit"
                  }, null, 8, ["src"]),
                  vue.createTextVNode(
                    " " + vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              256
              /* UNKEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "main" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(3, (item) => {
                return vue.createElementVNode("view", { class: "articlebox" }, [
                  vue.createVNode(_component_articlelist)
                ]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]);
      };
    }
  };
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-1cf27b2a"], ["__file", "E:/uniapp_learning/demo1/p2/pages/index/index.vue"]]);
  const _sfc_main$3 = {};
  function _sfc_render$1(_ctx, _cache) {
    return null;
  }
  const PagesCartCart = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$1], ["__file", "E:/uniapp_learning/demo1/p2/pages/cart/cart.vue"]]);
  const _sfc_main$2 = {};
  function _sfc_render(_ctx, _cache) {
    return null;
  }
  const PagesDetailDetail = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render], ["__file", "E:/uniapp_learning/demo1/p2/pages/detail/detail.vue"]]);
  const _sfc_main$1 = {
    __name: "mine",
    setup(__props) {
      const token = vue.ref("");
      const avatar = vue.ref("../../static/logo.png");
      onReady((x) => {
        token.value = uni.getStorageSync("token");
        DoValidateCode();
      });
      async function DoValidateCode() {
        await ValidateCode({
          token: token.value
        }).then((res) => {
          formatAppLog("log", "at pages/mine/mine.vue:53", "res", res);
        }).catch((err) => {
          uni.showToast({
            title: err.detail,
            icon: "none"
          });
          uni.redirectTo({
            url: "/pages/login/login"
          });
        });
      }
      function doUpload() {
        formatAppLog("log", "at pages/mine/mine.vue:65", "上传");
        uni.chooseImage({
          count: 6,
          //默认9
          sizeType: ["original", "compressed"],
          //可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album"],
          //从相册选择
          success: function(res) {
            formatAppLog("log", "at pages/mine/mine.vue:71", JSON.stringify(res.tempFilePaths), res.tempFiles);
          }
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "main" }, [
          vue.createElementVNode("view", { class: "avatar" }, [
            vue.createElementVNode("view", {
              class: "img",
              onClick: doUpload
            }, [
              vue.createElementVNode("image", {
                src: avatar.value,
                mode: "aspectFit"
              }, null, 8, ["src"])
            ]),
            vue.createElementVNode(
              "view",
              { class: "nickname" },
              vue.toDisplayString(_ctx.name || "默认用户xxxxx"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "detail" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(3, (item) => {
                return vue.createElementVNode("view", { class: "box" }, [
                  (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(4, (item2) => {
                      return vue.createElementVNode("view", { class: "item" }, [
                        vue.createElementVNode(
                          "view",
                          { class: "txt" },
                          vue.toDisplayString("测试文本" + item2),
                          1
                          /* TEXT */
                        ),
                        vue.createTextVNode(" " + vue.toDisplayString(">"))
                      ]);
                    }),
                    64
                    /* STABLE_FRAGMENT */
                  ))
                ]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "logout" }, [
            vue.createElementVNode("button", null, "退出登录")
          ])
        ]);
      };
    }
  };
  const PagesMineMine = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7c2ebfa5"], ["__file", "E:/uniapp_learning/demo1/p2/pages/mine/mine.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/list/list", PagesListList);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/cart/cart", PagesCartCart);
  __definePage("pages/detail/detail", PagesDetailDetail);
  __definePage("pages/mine/mine", PagesMineMine);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/uniapp_learning/demo1/p2/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
