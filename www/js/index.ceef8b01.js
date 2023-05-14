(function(){var e={9030:function(e){function t(e,t="GET",n={},r={}){return new Promise(((o,s)=>{r["Content-Type"]="application/json",fetch(e,{method:t,headers:r,body:"GET"!=t?JSON.stringify(n):void 0}).then((e=>e.json())).then((e=>{o(e)})).catch((e=>{s(e)}))}))}function n(e,n={},r={}){return t(e,"POST",n,r)}function r(e,n={},r={}){return t(e,"GET",n,r)}function o(e){let t="?";for(let n in e)void 0!==e[n]&&null!==e[n]&&(e[n]instanceof String&&e[n].length<1||e[n]instanceof Number&&isNaN(e[n])||(t+=n+"="+e[n]+"&"));return t=t.slice(0,-1),t.length<1?"":t}const s="/api";e.exports={parseForm:e=>{let t={};for(let n=0;n<e.length;n++)"submit"!==e[n].type&&(t[e[n].name]=e[n].value);return t},login:async(e,t)=>{if(""===e||""===t)throw"Логін та пароль не можуть бути пустими";const r=await n(s+"/auth/login",{login:e,password:t});if(200===r.status)return localStorage.setItem("token",r.token),localStorage.setItem("user",JSON.stringify(r.user)),r.user;switch(r.status){case 400:throw"Логін та пароль не можуть бути пустими";case 401:throw"Невірний логін або пароль";default:throw r.message}},register:async(e,t,r)=>{const o=await n(s+"/auth/register",{login:t,password:r,name:e});if(200===o.status)return localStorage.setItem("token",o.token),localStorage.setItem("user",JSON.stringify(o.user)),o.user;switch(o.status){default:throw o.message}},isLoggedIn:()=>null!==localStorage.getItem("token"),getToken:()=>localStorage.getItem("token"),getCurrentUser:()=>JSON.parse(localStorage.getItem("user")),logout:()=>{localStorage.removeItem("token"),localStorage.removeItem("user")},checkPerms:async()=>{if(!e.exports.isLoggedIn())throw"Ви не авторизовані";const t="Bearer "+localStorage.getItem("token"),n=await r(s+"/admin/perms",{},{authorization:t});if(200===n.status)return n.havePermission;throw n.message},getProfile:async t=>{if(!t&&!e.exports.isLoggedIn())throw"Ви не авторизовані, або не вказано id користувача";t||(t=e.exports.getCurrentUser().id);const n=await r(s+"/rating/user/"+t);if(200===n.status)return{name:n.name,average:n.average,comments:n.ratings,created_at:n.created_at};if(404===n.status)throw"Користувача не знайдено";throw n.message},postComment:async(t,r)=>{if(!e.exports.isLoggedIn())throw"Ви не авторизовані";if(t==e.exports.getCurrentUser().id)throw"Ви не можете залишити відгук самому собі";const o="Bearer "+localStorage.getItem("token"),a=await n(s+"/rating/user/"+t,r,{authorization:o});if(200===a.status)return a;throw a.message},editName:async t=>{if(!e.exports.isLoggedIn())throw"Ви не авторизовані";if(""==t)throw"Ім'я не може бути пустим";const r="Bearer "+localStorage.getItem("token"),o=await n(s+"/auth/change-name",{name:t},{authorization:r});if(200===o.status){let n=e.exports.getCurrentUser();return n.name=t,localStorage.setItem("user",JSON.stringify(n)),o}throw o.message},getHints:async e=>{const t=await r(s+"/trips/hints/?q="+e);if(200===t.status)return t.hints;throw t.message},createRide:async(t,r,o,a,l)=>{if(!e.exports.isLoggedIn())throw"Ви не авторизовані";if(""==t||""==r||""==o||""==a)throw"Заповніть всі поля";const i="Bearer "+localStorage.getItem("token"),c=await n(s+"/trips/",{start:t,end:r,passengers:o,time:a,description:l},{authorization:i});if(200===c.status)return c;throw c.message},getRides:async(t,n,a,l)=>{let i={};if(e.exports.isLoggedIn()){let e="Bearer "+localStorage.getItem("token");i={authorization:e}}let c=o({start:t,end:n,passengers:a,time:l});const u=await r(s+"/trips/"+c,{},i);if(200===u.status)return u.trips;throw u.message},getTrip:async t=>{let n={};if(e.exports.isLoggedIn()){let e="Bearer "+localStorage.getItem("token");n={authorization:e}}const o=await r(s+"/trips/"+t,{},n);if(200===o.status)return o.trip;throw o.message},getPassengerTrips:async()=>{if(!e.exports.isLoggedIn())throw"Ви не авторизовані";const t="Bearer "+localStorage.getItem("token"),n=await r(s+"/reservations/passenger",{},{authorization:t});if(200===n.status)return n.reservations;throw n.message},getDriverTrips:async()=>{if(!e.exports.isLoggedIn())throw"Ви не авторизовані";const t="Bearer "+localStorage.getItem("token"),n=await r(s+"/reservations/driver",{},{authorization:t});if(200===n.status)return n.trips;throw n.message},isTripReserved:async t=>{if(!e.exports.isLoggedIn())return!1;const n=await e.exports.getPassengerTrips();for(let e of n)if(e.id==t)return!0;return!1},reserveTrip:async(t,r)=>{if(!e.exports.isLoggedIn())throw"Ви не авторизовані";const o="Bearer "+localStorage.getItem("token"),a=await n(s+"/reservations/",{tripId:t,comment:r},{authorization:o});if(200===a.status)return a;throw a.message},getOwnTrips:async()=>{if(!e.exports.isLoggedIn())throw"Ви не авторизовані";const t=e.exports.getCurrentUser(),n="Bearer "+localStorage.getItem("token"),o=await r(s+"/trips/?driver_id="+t.id,{},{authorization:n});if(200===o.status)return o.trips;throw o.message}}},2324:function(e,t,n){"use strict";var r=n(9242),o=n(2483),s=n(3396),a=n(7139);const l={class:"container"},i={class:"p-3"},c={class:"container"},u={class:"d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"},d=(0,s._)("h1",{class:"fs-4"}," BlaBlaCar ",-1),m={class:"nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 mx-4"},h={key:0,class:"text-end"},g={class:"dropdown"},p={class:"btn btn-secondary dropdown-toggle",role:"button","data-bs-toggle":"dropdown","aria-expanded":"false"},w={class:"dropdown-menu","aria-labelledby":"dropdownMenuLink"},f={key:1,class:"text-end"},_=(0,s._)("button",{type:"button",class:"btn btn-outline-light me-2"},"Вхід / Реєстрація",-1),b={class:"text-bg-dark"},v={class:"container py-4"},k={class:"d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top"},y={class:"col-md-4 d-flex align-items-center"},D=(0,s._)("a",{href:"/",class:"mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"},[(0,s._)("svg",{class:"bi",width:"30",height:"24"},[(0,s._)("use",{"xlink:href":"#bootstrap"})])],-1),U={class:"mb-3 mb-md-0 text-muted"};function x(e,t,n,r,o,x){const C=(0,s.up)("router-link"),R=(0,s.up)("router-view");return(0,s.wg)(),(0,s.iD)(s.HY,null,[(0,s._)("div",l,[(0,s._)("header",i,[(0,s._)("div",c,[(0,s._)("div",u,[(0,s.Wm)(C,{to:"/",class:"d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"},{default:(0,s.w5)((()=>[d])),_:1}),(0,s._)("ul",m,[(0,s._)("li",null,[(0,s.Wm)(C,{to:"/",class:"nav-link px-2 text-white"},{default:(0,s.w5)((()=>[(0,s.Uk)("Головна")])),_:1})]),(0,s._)("li",null,[(0,s.Wm)(C,{to:"/rides",class:"nav-link px-2 text-white"},{default:(0,s.w5)((()=>[(0,s.Uk)("Поїздки")])),_:1})]),(0,s._)("li",null,[(0,s.Wm)(C,{to:"/create",class:"nav-link px-2 text-white"},{default:(0,s.w5)((()=>[(0,s.Uk)("Створити поїздку")])),_:1})])]),e.account?((0,s.wg)(),(0,s.iD)("div",h,[(0,s._)("div",g,[(0,s._)("a",p,(0,a.zw)(e.account.name),1),(0,s._)("div",w,[(0,s.Wm)(C,{class:"dropdown-item",to:"/profile"},{default:(0,s.w5)((()=>[(0,s.Uk)("Профіль")])),_:1}),(0,s.Wm)(C,{class:"dropdown-item",to:"/reservations"},{default:(0,s.w5)((()=>[(0,s.Uk)("Бронювання та поїздки")])),_:1}),e.account.admin?((0,s.wg)(),(0,s.j4)(C,{key:0,class:"dropdown-item",to:"/admin"},{default:(0,s.w5)((()=>[(0,s.Uk)("Панель керування")])),_:1})):(0,s.kq)("",!0),(0,s.Wm)(C,{class:"dropdown-item",to:"/",onClick:t[0]||(t[0]=e=>x.logout())},{default:(0,s.w5)((()=>[(0,s.Uk)("Вийти")])),_:1})])])])):(0,s.kq)("",!0),e.account?(0,s.kq)("",!0):((0,s.wg)(),(0,s.iD)("div",f,[(0,s.Wm)(C,{to:"/login",class:"text-decoration-none"},{default:(0,s.w5)((()=>[_])),_:1})]))])])])]),(0,s._)("main",b,[(0,s._)("div",v,[(0,s.Wm)(R)])]),(0,s._)("footer",k,[(0,s._)("div",y,[D,(0,s._)("span",U,"© "+(0,a.zw)((new Date).getFullYear())+" BlaBlaCar",1)])])],64)}const C=n(9030);var R={name:"App",data:()=>({account:null}),created(){this.$watch((()=>this.$route.params),(()=>{this.loadProfile()}),{immediate:!0})},methods:{logout(){C.logout(),this.account=null},loadProfile(){if(!this.account){const e=localStorage.getItem("user");e&&(this.account=JSON.parse(e),C.checkPerms().then((e=>{this.account.admin=e})).catch((()=>{this.account.admin=!1})))}}}},S=n(89);const T=(0,S.Z)(R,[["render",x]]);var z=T;const I=(0,s._)("h1",null,"Шукаєте як зекономити на таксі?",-1),P=(0,s._)("p",null," Знайдіть собі попутника або водія, щоб подорожувати разом та економити. ",-1);function N(e,t,n,r,o,a){const l=(0,s.up)("router-link");return(0,s.wg)(),(0,s.iD)("div",null,[I,P,(0,s._)("p",null,[(0,s.Wm)(l,{to:"/rides"},{default:(0,s.w5)((()=>[(0,s.Uk)("Перейти до пошуку")])),_:1})])])}var $={name:"HomePage"};const L=(0,S.Z)($,[["render",N]]);var O=L;const W=e=>((0,s.dD)("data-v-449a0391"),e=e(),(0,s.Cn)(),e),q={key:0,class:"login-form",id:"login-form"},B=W((()=>(0,s._)("h2",null,"Вхід",-1))),V={key:0,class:"alert alert-dark",role:"alert"},F={class:"form-floating"},H=W((()=>(0,s._)("label",{for:"floatingInput"},"Логін",-1))),A={class:"form-floating"},Z=W((()=>(0,s._)("label",{for:"floatingPassword"},"Пароль",-1))),Y={class:"mb-2"},j={key:1,class:"login-form",id:"register-form"},E=W((()=>(0,s._)("h2",null,"Реєстрація",-1))),K={key:0,class:"alert alert-dark",role:"alert"},J={class:"form-floating"},M=W((()=>(0,s._)("label",{for:"floatingInput"},"Ім'я",-1))),G={class:"form-floating"},Q=W((()=>(0,s._)("label",{for:"floatingLogin"},"Логін",-1))),X={class:"form-floating"},ee=W((()=>(0,s._)("label",{for:"floatingPassword"},"Пароль",-1))),te={class:"mb-2"};function ne(e,t,n,o,l,i){return(0,s.wg)(),(0,s.iD)(s.HY,null,["login"==e.mode?((0,s.wg)(),(0,s.iD)("form",q,[B,e.error?((0,s.wg)(),(0,s.iD)("div",V,(0,a.zw)(e.error),1)):(0,s.kq)("",!0),(0,s._)("div",F,[(0,s.wy)((0,s._)("input",{type:"text",class:"form-control",id:"floatingInput",placeholder:"Login",name:"login",required:"",minlength:"3","onUpdate:modelValue":t[0]||(t[0]=t=>e.login=t)},null,512),[[r.nr,e.login]]),H]),(0,s._)("div",A,[(0,s.wy)((0,s._)("input",{type:"password",class:"form-control",id:"floatingPassword",placeholder:"Password",name:"password",required:"",minlength:"8","onUpdate:modelValue":t[1]||(t[1]=t=>e.password=t)},null,512),[[r.nr,e.password]]),Z]),(0,s._)("button",{class:"w-100 btn btn-lg btn-primary my-4",type:"submit",onClick:t[2]||(t[2]=e=>i.tryLogin(e))},"Увійти"),(0,s._)("p",Y,[(0,s._)("a",{href:"#",onClick:t[3]||(t[3]=t=>e.mode="register")},"Зареєструватися")])])):(0,s.kq)("",!0),"register"==e.mode?((0,s.wg)(),(0,s.iD)("form",j,[E,e.error?((0,s.wg)(),(0,s.iD)("div",K,(0,a.zw)(e.error),1)):(0,s.kq)("",!0),(0,s._)("div",J,[(0,s.wy)((0,s._)("input",{type:"text",class:"form-control",id:"floatingInput",placeholder:"Ім'я",name:"name",required:"",minlength:"3","onUpdate:modelValue":t[4]||(t[4]=t=>e.name=t)},null,512),[[r.nr,e.name]]),M]),(0,s._)("div",G,[(0,s.wy)((0,s._)("input",{type:"text",class:"form-control",id:"floatingLogin",placeholder:"Логін",name:"login",required:"",minlength:"3","onUpdate:modelValue":t[5]||(t[5]=t=>e.login=t)},null,512),[[r.nr,e.login]]),Q]),(0,s._)("div",X,[(0,s.wy)((0,s._)("input",{type:"password",class:"form-control",id:"floatingPassword",placeholder:"Пароль",name:"password",minlength:"8",required:"","onUpdate:modelValue":t[6]||(t[6]=t=>e.password=t)},null,512),[[r.nr,e.password]]),ee]),(0,s._)("button",{class:"w-100 btn btn-lg btn-primary my-4",type:"submit",onClick:t[7]||(t[7]=e=>i.tryRegister(e))},"Зареєструватись"),(0,s._)("p",te,[(0,s._)("a",{href:"#",onClick:t[8]||(t[8]=t=>e.mode="login")},"Увійти")])])):(0,s.kq)("",!0)],64)}n(7658);const re=n(9030);var oe={name:"LoginPage",data:()=>({mode:"login",name:"",login:"",password:"",error:null}),created(){this.$watch((()=>this.$route.params),(()=>{re.isLoggedIn()&&this.$router.push("/")}),{immediate:!0})},methods:{tryLogin:async function(e){e.preventDefault();try{await re.login(this.login,this.password),this.$router.push("/")}catch(t){this.error=t}},tryRegister:async function(e){e.preventDefault();try{await re.register(this.name,this.login,this.password),this.$router.push("/")}catch(t){this.error=t}}}};const se=(0,S.Z)(oe,[["render",ne],["__scopeId","data-v-449a0391"]]);var ae=se;const le={key:0},ie={key:0},ce={key:1,class:"row g-3",ref:"nameEditForm"},ue={class:"col-auto"},de=(0,s._)("label",{for:"editedName",class:"visually-hidden"},"Ім'я",-1),me={class:"col-auto"},he={class:"col-auto"},ge={key:2},pe=(0,s._)("h4",null,"Залишити відгук:",-1),we={class:"mb-1"},fe=(0,s._)("span",null,"Оцінка: ",-1),_e={class:"mb-3"},be=(0,s._)("label",{for:"editedComment",class:"form-label"},"Коментар:",-1),ve=(0,s._)("h3",null,"Відгуки:",-1),ke={class:"list-group list-group-flush"},ye={key:0,class:"list-group-item"},De={key:1},Ue={key:2},xe=(0,s._)("p",null,"Завантаження...",-1),Ce=[xe];function Re(e,t,n,o,l,i){const c=(0,s.up)("StarRating"),u=(0,s.up)("router-link");return e.account?((0,s.wg)(),(0,s.iD)("div",le,[e.editingName?((0,s.wg)(),(0,s.iD)("form",ce,[(0,s._)("div",ue,[de,(0,s.wy)((0,s._)("input",{type:"text",class:"form-control",id:"editedName",placeholder:"Ім'я","onUpdate:modelValue":t[1]||(t[1]=t=>e.editedName=t),required:"",minlength:"3"},null,512),[[r.nr,e.editedName]])]),(0,s._)("div",me,[(0,s._)("button",{type:"submit",class:"btn btn-primary mb-3",onClick:t[2]||(t[2]=e=>i.editName(e,this.$refs.nameEditForm))},"Зберегти")]),(0,s._)("div",he,[(0,s._)("button",{type:"submit",class:"btn btn-secondary mb-3",onClick:t[3]||(t[3]=t=>{t.preventDefault(),e.editingName=!1})},"Скасувати")])],512)):((0,s.wg)(),(0,s.iD)("h2",ie,[(0,s.Uk)((0,a.zw)(e.account.name)+" ",1),e.ownAccount?((0,s.wg)(),(0,s.iD)("a",{key:0,href:"#",style:{"font-size":"small"},onClick:t[0]||(t[0]=t=>{t.preventDefault(),e.editingName=!0})},"Змінити")):(0,s.kq)("",!0)])),(0,s._)("p",null,"Дата реєстрації: "+(0,a.zw)(e.account.created_at),1),(0,s._)("p",null,[(0,s.Uk)(" Оцінка: "),(0,s.Wm)(c,{rating:e.account.average},null,8,["rating"]),(0,s.Uk)(" ("+(0,a.zw)(Math.round(100*e.account.average)/100)+") ",1)]),e.showPrompt?((0,s.wg)(),(0,s.iD)("div",ge,[pe,(0,s._)("div",we,[fe,(0,s.Wm)(c,{readonly:!1,rating:e.editedComment.rating,"onUpdate:rating":i.updateRating},null,8,["rating","onUpdate:rating"])]),(0,s._)("div",_e,[be,(0,s.wy)((0,s._)("textarea",{class:"form-control",id:"editedComment",rows:"3","onUpdate:modelValue":t[4]||(t[4]=t=>e.editedComment.comment=t)},null,512),[[r.nr,e.editedComment.comment]])]),(0,s._)("div",null,[(0,s._)("button",{class:"btn btn-sm btn-primary",onClick:t[5]||(t[5]=e=>i.sendRating())},"Залишити")])])):(0,s.kq)("",!0),ve,(0,s._)("ul",ke,[0==e.account.comments.length?((0,s.wg)(),(0,s.iD)("li",ye,"Порожньо")):((0,s.wg)(!0),(0,s.iD)(s.HY,{key:1},(0,s.Ko)(e.account.comments,(e=>((0,s.wg)(),(0,s.iD)("li",{class:"list-group-item",key:e.id},[(0,s._)("span",null,[(0,s.Wm)(u,{to:"/profile/"+e.creator_id},{default:(0,s.w5)((()=>[(0,s.Uk)((0,a.zw)(e.creator_name),1)])),_:2},1032,["to"]),(0,s.Uk)(" - "+(0,a.zw)(e.time),1)]),(0,s._)("p",null,[(0,s.Wm)(c,{rating:e.rating},null,8,["rating"]),(0,s.Uk)(" "+(0,a.zw)(e.comment),1)])])))),128))])])):e.error?((0,s.wg)(),(0,s.iD)("div",De,[(0,s._)("p",null,(0,a.zw)(e.error),1)])):((0,s.wg)(),(0,s.iD)("div",Ue,Ce))}const Se=["onClick"];function Te(e,t,n,r,o,l){return(0,s.wg)(),(0,s.iD)(s.HY,null,(0,s.Ko)(5,((e,t)=>(0,s._)("span",{key:t,class:(0,a.C_)("fa fa-star"+(n.rating>=t+1?" checked":"")),onClick:e=>!n.readonly&&l.updateRating(t+1)},null,10,Se))),64)}var ze={name:"StarRating",props:{rating:{type:Number,required:!0},readonly:{type:Boolean,default:!0}},methods:{updateRating(e){this.$emit("update:rating",e)}}};const Ie=(0,S.Z)(ze,[["render",Te],["__scopeId","data-v-80c051ee"]]);var Pe=Ie;const Ne=n(9030);var $e={name:"ProfilePage",data:()=>({account:null,error:null,showPrompt:!1,ownAccount:!1,editedComment:{rating:0,comment:""},editingName:!1,editedName:""}),created(){this.$watch((()=>this.$route.params),(()=>{this.loadProfile()}),{immediate:!0})},methods:{loadProfile(){const e=Ne.isLoggedIn()?Ne.getCurrentUser().id:null;this.showPrompt=!1,this.editingName=!1,this.ownAccount=!1,!e||this.$route.params.id&&this.$route.params.id!=e||(this.ownAccount=!0,this.editedName=Ne.getCurrentUser().name),this.$route.params.id?Ne.getProfile(this.$route.params.id).then((t=>{this.account=t,this.account.id=this.$route.params.id,Ne.isLoggedIn()&&this.account.id!=e&&(console.log(this.account.id,e),this.showPrompt=!0)})).catch((e=>{this.error=e})):Ne.getProfile().then((t=>{this.account=t,this.account.id=e,this.ownAccount=!0,this.editedName=this.account.name})).catch((e=>{this.error=e}))},updateRating(e){this.editedComment.rating=e},sendRating(){0!=this.editedComment.rating&&Ne.postComment(this.account.id,this.editedComment).then((()=>{this.editedComment={rating:0,comment:""},this.showPrompt=!1,this.error=null,this.account=null,this.loadProfile()})).catch((e=>{console.log(e),this.error=e.message}))},editName(e,t){e.preventDefault(),t.checkValidity()?Ne.editName(this.editedName).then((()=>{this.account.name=this.editedName,this.editingName=!1,location.reload()})).catch((e=>{console.log(e),this.error=e.message})):t.reportValidity()}},components:{StarRating:Pe}};const Le=(0,S.Z)($e,[["render",Re]]);var Oe=Le;const We=(0,s._)("h1",null,"Створити поїздку",-1),qe={ref:"createRideForm"},Be={class:"mb-3 row"},Ve=(0,s._)("label",{class:"col-sm-2 col-form-label"},"Звідки",-1),Fe={class:"col-sm-10"},He={class:"mb-3 row"},Ae=(0,s._)("label",{class:"col-sm-2 col-form-label"},"Куди",-1),Ze={class:"col-sm-10"},Ye={class:"mb-3 row"},je=(0,s._)("label",{class:"col-sm-2 col-form-label"},"Кількість пасажирів",-1),Ee={class:"col-sm-10"},Ke={class:"mb-3 row"},Je=(0,s._)("label",{class:"col-sm-2 col-form-label"},"Дата/час",-1),Me={class:"col-sm-10"},Ge={class:"mb-3"},Qe=(0,s._)("label",{class:"form-label"},"Опис (авто, умови, місце зустрічі)",-1),Xe=["disabled"];function et(e,t,n,o,a,l){const i=(0,s.up)("AddressSearchBox");return(0,s.wg)(),(0,s.iD)(s.HY,null,[We,(0,s._)("form",qe,[(0,s._)("div",Be,[Ve,(0,s._)("div",Fe,[(0,s.Wm)(i,{placeholder:"Звідки",onChanged:l.changeFrom},null,8,["onChanged"])])]),(0,s._)("div",He,[Ae,(0,s._)("div",Ze,[(0,s.Wm)(i,{placeholder:"Куди",onChanged:l.changeTo},null,8,["onChanged"])])]),(0,s._)("div",Ye,[je,(0,s._)("div",Ee,[(0,s.wy)((0,s._)("input",{type:"number",class:"form-control",placeholder:"Кількість пасажирів","onUpdate:modelValue":t[0]||(t[0]=t=>e.count=t),required:"",min:"1"},null,512),[[r.nr,e.count]])])]),(0,s._)("div",Ke,[Je,(0,s._)("div",Me,[(0,s.wy)((0,s._)("input",{type:"datetime-local",class:"form-control","onUpdate:modelValue":t[1]||(t[1]=t=>e.date=t),required:""},null,512),[[r.nr,e.date]])])]),(0,s._)("div",Ge,[Qe,(0,s.wy)((0,s._)("textarea",{class:"form-control",rows:"3","onUpdate:modelValue":t[2]||(t[2]=t=>e.description=t)},null,512),[[r.nr,e.description]])]),(0,s._)("button",{class:"btn btn-primary",disabled:e.buttonDisabled,onClick:t[3]||(t[3]=t=>l.submitRide(t,e.$refs.createRideForm))},"Опублікувати",8,Xe)],512)],64)}const tt=["placeholder"],nt=["onClick"];function rt(e,t,n,o,l,i){return(0,s.wg)(),(0,s.iD)(s.HY,null,[(0,s.wy)((0,s._)("input",{type:"text","onUpdate:modelValue":t[0]||(t[0]=e=>l.searchTerm=e),onInput:t[1]||(t[1]=(...e)=>i.search&&i.search(...e)),placeholder:n.placeholder,class:"form-control",onFocus:t[2]||(t[2]=(...e)=>i.showResults&&i.showResults(...e))},null,40,tt),[[r.nr,l.searchTerm]]),(0,s._)("div",{class:(0,a.C_)("dropdown-menu mt-0"+(l.showDropdown&&l.searchResults.length>0?" d-block":" d-none"))},[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(l.searchResults,(e=>((0,s.wg)(),(0,s.iD)("li",{class:"dropdown-item",key:e.id,onClick:t=>i.selectResult(e,t)},(0,a.zw)(e.name),9,nt)))),128))],2)],64)}const ot=n(9030);var st={name:"AddressSearchBox",data(){return{searchTerm:"",searchResults:[],showDropdown:!1,timeout:null}},props:{placeholder:{type:String,default:"Search..."}},methods:{search(){if(0==this.searchTerm.length)return this.searchResults=[],void this.$emit("deleted","");this.timeout&&clearTimeout(this.timeout),this.timeout=setTimeout((()=>{this.searchResults=[],this.searchTerm.length>0&&this.getSearchResults()}),500)},getSearchResults(){ot.getHints(this.searchTerm).then((e=>{for(let t=0;t<e.length;t++)this.searchResults.push({id:t,name:e[t]})}))},selectResult(e,t){t.stopPropagation(),this.searchTerm=e.name,this.searchResults=[],this.$emit("changed",e.name)},showResults(){this.showDropdown=!0},hideResults(){this.showDropdown=!1}}};const at=(0,S.Z)(st,[["render",rt]]);var lt=at;const it=n(9030);var ct={name:"CreateRidePage",components:{AddressSearchBox:lt},data:()=>({from:null,to:null,count:1,date:(new Date).toISOString().slice(0,16),description:"",buttonDisabled:!0}),created(){this.$watch((()=>this.$route.params),(()=>{it.isLoggedIn()||this.$router.push("/login")}),{immediate:!0})},methods:{changeFrom(e){this.from=e,this.buttonDisabled=!this.from||!this.to},changeTo(e){this.to=e,this.buttonDisabled=!this.from||!this.to},submitRide(e,t){if(e.preventDefault(),t.checkValidity()){var n=new Date(this.date).getTime()/1e3;this.from&&this.to&&it.createRide(this.from,this.to,this.count,n,this.description).then((()=>{this.$router.push("/reservations")})).catch((e=>{console.error(e),alert(e)}))}else t.reportValidity()}}};const ut=(0,S.Z)(ct,[["render",et]]);var dt=ut;const mt=(0,s._)("h1",null,"Пошук поїздки",-1),ht={ref:"createRideForm"},gt={class:"mb-3 row"},pt=(0,s._)("label",{class:"col-sm-2 col-form-label"},"Звідки",-1),wt={class:"col-sm-10"},ft={class:"mb-3 row"},_t=(0,s._)("label",{class:"col-sm-2 col-form-label"},"Куди",-1),bt={class:"col-sm-10"},vt={class:"mb-3 row"},kt=(0,s._)("label",{class:"col-sm-2 col-form-label"},"Кількість пасажирів",-1),yt={class:"col-sm-10"},Dt={class:"mb-3 row"},Ut=(0,s._)("label",{class:"col-sm-2 col-form-label"},"Виїзд до",-1),xt={class:"col-sm-10"},Ct=(0,s._)("hr",null,null,-1),Rt={key:0},St=(0,s._)("p",null,"Завантаження...",-1),Tt=[St],zt={key:1},It={key:2},Pt=(0,s._)("p",null,"Нічого не знайдено",-1),Nt=[Pt],$t={key:3},Lt={class:"list-group list-group-flush"},Ot={class:"h5"},Wt={class:"mb-2"},qt=(0,s._)("br",null,null,-1),Bt=(0,s._)("b",null,"Звідки:",-1),Vt=(0,s._)("br",null,null,-1),Ft=(0,s._)("b",null,"Куди:",-1),Ht=(0,s._)("button",{type:"button",class:"btn btn-success"}," Детальніше » ",-1);function At(e,t,n,o,l,i){const c=(0,s.up)("AddressSearchBox"),u=(0,s.up)("router-link");return(0,s.wg)(),(0,s.iD)(s.HY,null,[mt,(0,s._)("form",ht,[(0,s._)("div",gt,[pt,(0,s._)("div",wt,[(0,s.Wm)(c,{placeholder:"Звідки",onChanged:i.changeFrom,onDeleted:i.removeFrom},null,8,["onChanged","onDeleted"])])]),(0,s._)("div",ft,[_t,(0,s._)("div",bt,[(0,s.Wm)(c,{placeholder:"Куди",onChanged:i.changeTo,onDeleted:i.removeTo},null,8,["onChanged","onDeleted"])])]),(0,s._)("div",vt,[kt,(0,s._)("div",yt,[(0,s.wy)((0,s._)("input",{type:"number",class:"form-control",placeholder:"Кількість пасажирів","onUpdate:modelValue":t[0]||(t[0]=t=>e.count=t),min:"1"},null,512),[[r.nr,e.count]])])]),(0,s._)("div",Dt,[Ut,(0,s._)("div",xt,[(0,s.wy)((0,s._)("input",{type:"datetime-local",class:"form-control","onUpdate:modelValue":t[1]||(t[1]=t=>e.date=t)},null,512),[[r.nr,e.date]])])]),(0,s._)("button",{class:"btn btn-primary",onClick:t[2]||(t[2]=t=>i.searchRide(t,e.$refs.createRideForm))},"Пошук")],512),Ct,e.loading?((0,s.wg)(),(0,s.iD)("div",Rt,Tt)):e.error?((0,s.wg)(),(0,s.iD)("div",zt,[(0,s._)("p",null,"Помилка: "+(0,a.zw)(e.error),1)])):0===e.trips.length?((0,s.wg)(),(0,s.iD)("div",It,Nt)):((0,s.wg)(),(0,s.iD)("div",$t,[(0,s._)("ul",Lt,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(e.trips,(e=>((0,s.wg)(),(0,s.iD)("li",{class:"list-group-item",key:e.id},[(0,s._)("span",Ot,[(0,s.Wm)(u,{to:"/profile/"+e.driver_id},{default:(0,s.w5)((()=>[(0,s.Uk)((0,a.zw)(e.driver_name),1)])),_:2},1032,["to"]),(0,s.Uk)(" - "+(0,a.zw)(new Date(1e3*e.time).toLocaleString("uk-UA",{timeZone:"Europe/Kiev"})),1)]),(0,s._)("div",Wt,[(0,s._)("b",null,(0,a.zw)(e.passengers)+" "+(0,a.zw)(i.countParse(e.passengers)),1),qt,(0,s._)("span",null,[Bt,(0,s.Uk)(" "+(0,a.zw)(e.start),1)]),Vt,(0,s._)("span",null,[Ft,(0,s.Uk)(" "+(0,a.zw)(e.end),1)])]),(0,s._)("span",null,[(0,s.Wm)(u,{to:"/rides/"+e.id},{default:(0,s.w5)((()=>[Ht])),_:2},1032,["to"])])])))),128))])]))],64)}const Zt=n(9030);var Yt={name:"SearchRidePage",components:{AddressSearchBox:lt},data:()=>({from:null,to:null,count:1,date:(new Date).toISOString().slice(0,16),trips:[],error:null,loading:!1}),created(){this.$watch((()=>this.$route.params),(()=>{this.loadTrips()}),{immediate:!0})},methods:{changeFrom(e){this.from=e},changeTo(e){this.to=e},removeFrom(){this.from=null},removeTo(){this.to=null},loadTrips(){if(!this.trips.length){this.loading=!0,this.error=null;var e=new Date(this.date).getTime()/1e3;Zt.getRides(this.from,this.to,this.count,e).then((e=>{this.trips=e,this.loading=!1})).catch((e=>{this.error=e,this.loading=!1}))}},searchRide(e,t){e.preventDefault(),t.checkValidity()?(this.trips=[],this.loadTrips()):t.reportValidity()},countParse(e){return e%10===1&&e%100!==11?"місце":e%10>=2&&e%10<=4&&(e%100<10||e%100>=20)?"місця":"місць"}}};const jt=(0,S.Z)(Yt,[["render",At]]);var Et=jt;const Kt={key:0},Jt=(0,s._)("h1",null,"Деталі про поїздку",-1),Mt=(0,s._)("b",null,"Відправлення:",-1),Gt=(0,s._)("br",null,null,-1),Qt=(0,s._)("b",null,"Прибуття:",-1),Xt=(0,s._)("br",null,null,-1),en=(0,s._)("b",null,"Кількість пасажирів:",-1),tn=(0,s._)("br",null,null,-1),nn=(0,s._)("b",null,"Дата відправлення:",-1),rn=(0,s._)("br",null,null,-1),on=(0,s._)("b",null,"Водій:",-1),sn=(0,s._)("br",null,null,-1),an={key:0},ln=(0,s._)("hr",null,null,-1),cn=(0,s._)("h3",null,"Забронювати?",-1),un={class:"mb-3"},dn=(0,s._)("label",{class:"form-label"},"Повідомлення водію (контакти, які речі, наявність дітей)",-1),mn={key:1},hn=(0,s._)("hr",null,null,-1),gn=(0,s._)("h4",null,"Ви вже забронювали цю поїздку",-1),pn=[hn,gn],wn={key:1},fn={key:2},_n=(0,s._)("p",null,"Завантаження...",-1),bn=[_n];function vn(e,t,n,o,l,i){const c=(0,s.up)("router-link");return e.trip?((0,s.wg)(),(0,s.iD)("div",Kt,[Jt,(0,s._)("p",null,[Mt,(0,s.Uk)(" "+(0,a.zw)(e.trip.start),1),Gt,Qt,(0,s.Uk)(" "+(0,a.zw)(e.trip.end),1),Xt,en,(0,s.Uk)(" "+(0,a.zw)(e.trip.passengers),1),tn,nn,(0,s.Uk)(" "+(0,a.zw)(new Date(1e3*e.trip.time).toLocaleString("uk-UA",{timeZone:"Europe/Kiev"})),1),rn,on,(0,s.Uk)(),(0,s.Wm)(c,{to:"/profile/"+e.trip.driver_id},{default:(0,s.w5)((()=>[(0,s.Uk)((0,a.zw)(e.trip.driver_name),1)])),_:1},8,["to"]),sn]),e.canReserve?((0,s.wg)(),(0,s.iD)("div",an,[ln,cn,(0,s._)("div",un,[dn,(0,s.wy)((0,s._)("textarea",{class:"form-control",rows:"3","onUpdate:modelValue":t[0]||(t[0]=t=>e.description=t)},null,512),[[r.nr,e.description]])]),(0,s._)("button",{class:"btn btn-primary",onClick:t[1]||(t[1]=(...e)=>i.reserve&&i.reserve(...e))},"Забронювати")])):(0,s.kq)("",!0),e.alreadyReserved?((0,s.wg)(),(0,s.iD)("div",mn,pn)):(0,s.kq)("",!0)])):e.error?((0,s.wg)(),(0,s.iD)("div",wn,[(0,s._)("p",null,(0,a.zw)(e.error),1)])):((0,s.wg)(),(0,s.iD)("div",fn,bn))}const kn=n(9030);var yn={name:"RidePage",data:()=>({trip:null,error:null,canReserve:!1,description:"",alreadyReserved:!1}),created(){this.$watch((()=>this.$route.params),(()=>{this.loadTrip()}),{immediate:!0})},methods:{loadTrip(){this.error=null,this.canReserve=!1,kn.getTrip(this.$route.params.id).then((e=>{this.trip=e,kn.isLoggedIn()&&e.driver_id!==kn.getCurrentUser().id&&(this.alreadyReserved=kn.isTripReserved(e.id),this.canReserve=!this.alreadyReserved)})).catch((e=>{this.error=e}))},reserve(){kn.reserveTrip(this.$route.params.id,this.description).then((()=>{location.reload()})).catch((e=>{this.error=e,alert(e)}))}}};const Dn=(0,S.Z)(yn,[["render",vn]]);var Un=Dn;const xn=(0,s._)("hr",null,null,-1),Cn={key:0},Rn={key:1},Sn=(0,s._)("p",null,"Завантаження...",-1),Tn=[Sn],zn={key:2},In={class:"list-group list-group-flush"},Pn={key:0,class:"list-group-item"},Nn={class:"mb-2"},$n=(0,s._)("b",null,"Звідки:",-1),Ln=(0,s._)("br",null,null,-1),On=(0,s._)("b",null,"Куди:",-1),Wn=(0,s._)("br",null,null,-1),qn=(0,s._)("b",null,"Коли:",-1),Bn=(0,s._)("button",{type:"button",class:"btn btn-success"}," Детальніше » ",-1),Vn={key:3},Fn={class:"list-group list-group-flush"},Hn={key:0,class:"list-group-item"},An={class:"mb-2"},Zn=(0,s._)("b",null,"Звідки:",-1),Yn=(0,s._)("br",null,null,-1),jn=(0,s._)("b",null,"Куди:",-1),En=(0,s._)("br",null,null,-1),Kn=(0,s._)("b",null,"Коли:",-1),Jn={class:"mb-2"},Mn=(0,s._)("b",null,"Час бронювання:",-1),Gn=(0,s._)("br",null,null,-1),Qn=(0,s._)("b",null,"Ваш коментар:",-1),Xn=(0,s._)("br",null,null,-1),er={key:0,class:"mb-2"},tr=(0,s._)("b",null,"Відповідь:",-1),nr=(0,s._)("br",null,null,-1),rr=(0,s._)("b",null,"Час відповіді:",-1),or=(0,s._)("br",null,null,-1),sr=(0,s._)("b",null,"Статус відповіді:",-1),ar={key:1,class:"mb-2"},lr=(0,s._)("b",null,"Очікуйте на відповідь",-1),ir=[lr],cr=(0,s._)("button",{type:"button",class:"btn btn-success"}," Детальніше » ",-1);function ur(e,t,n,r,o,l){const i=(0,s.up)("router-link");return(0,s.wg)(),(0,s.iD)(s.HY,null,[(0,s._)("button",{type:"button",class:"btn btn-primary",onClick:t[0]||(t[0]=e=>l.switchPage(!1))},"Мої резервування"),(0,s._)("button",{type:"button",class:"btn btn-secondary mx-2",onClick:t[1]||(t[1]=e=>l.switchPage(!0))},"Мої поїздки"),xn,e.error?((0,s.wg)(),(0,s.iD)("div",Cn,[(0,s._)("p",null,(0,a.zw)(e.error),1)])):e.loading?((0,s.wg)(),(0,s.iD)("div",Rn,Tn)):e.showOwnTrips?((0,s.wg)(),(0,s.iD)("div",zn,[(0,s._)("ul",In,[0==e.trips.length?((0,s.wg)(),(0,s.iD)("li",Pn,"Порожньо")):((0,s.wg)(!0),(0,s.iD)(s.HY,{key:1},(0,s.Ko)(e.trips,(e=>((0,s.wg)(),(0,s.iD)("li",{class:"list-group-item",key:e.id},[(0,s._)("div",Nn,[(0,s._)("span",null,[$n,(0,s.Uk)(" "+(0,a.zw)(e.start),1)]),Ln,(0,s._)("span",null,[On,(0,s.Uk)(" "+(0,a.zw)(e.end),1)]),Wn,(0,s._)("span",null,[qn,(0,s.Uk)(" "+(0,a.zw)(new Date(1e3*e.time).toLocaleString("uk-UA",{timeZone:"Europe/Kiev"})),1)])]),(0,s._)("span",null,[(0,s.Wm)(i,{to:"/rides/"+e.id},{default:(0,s.w5)((()=>[Bn])),_:2},1032,["to"])])])))),128))])])):((0,s.wg)(),(0,s.iD)("div",Vn,[(0,s._)("ul",Fn,[0==e.trips.length?((0,s.wg)(),(0,s.iD)("li",Hn,"Порожньо")):((0,s.wg)(!0),(0,s.iD)(s.HY,{key:1},(0,s.Ko)(e.trips,(e=>((0,s.wg)(),(0,s.iD)("li",{class:"list-group-item",key:e.id},[(0,s._)("div",An,[(0,s._)("span",null,[Zn,(0,s.Uk)(" "+(0,a.zw)(e.start),1)]),Yn,(0,s._)("span",null,[jn,(0,s.Uk)(" "+(0,a.zw)(e.end),1)]),En,(0,s._)("span",null,[Kn,(0,s.Uk)(" "+(0,a.zw)(new Date(1e3*e.trip_time).toLocaleString("uk-UA",{timeZone:"Europe/Kiev"})),1)])]),(0,s._)("div",Jn,[(0,s._)("span",null,[Mn,(0,s.Uk)(" "+(0,a.zw)(e.time),1)]),Gn,(0,s._)("span",null,[Qn,(0,s.Uk)(" "+(0,a.zw)(e.comment),1)]),Xn]),e.response?((0,s.wg)(),(0,s.iD)("div",er,[(0,s._)("span",null,[tr,(0,s.Uk)(" "+(0,a.zw)(e.response),1)]),nr,(0,s._)("span",null,[rr,(0,s.Uk)(" "+(0,a.zw)(e.response_time),1)]),or,(0,s._)("span",null,[sr,(0,s.Uk)(" "+(0,a.zw)(1==e.status?"Погоджено":"Відхилено"),1)])])):((0,s.wg)(),(0,s.iD)("div",ar,ir)),(0,s._)("span",null,[(0,s.Wm)(i,{to:"/rides/"+e.id},{default:(0,s.w5)((()=>[cr])),_:2},1032,["to"])])])))),128))])]))],64)}const dr=n(9030);var mr={name:"ReservationsPage",data:()=>({trips:[],error:null,loading:!1,showOwnTrips:!1}),created(){this.loadTrips()},methods:{loadTrips(){this.error=null,this.loading=!0,this.showOwnTrips?dr.getOwnTrips().then((e=>{this.trips=e,this.loading=!1})).catch((e=>{this.error=e,this.loading=!1})):dr.getPassengerTrips().then((e=>{this.trips=e,this.loading=!1})).catch((e=>{this.error=e,this.loading=!1}))},switchPage(e){this.showOwnTrips!==e&&(this.showOwnTrips=e,this.loadTrips())}}};const hr=(0,S.Z)(mr,[["render",ur]]);var gr=hr;const pr=(0,s._)("h1",{class:"display-1 font-weight-bold",style:{"font-size":"3em"}}," 404 - Сторінку не знайдено ",-1),wr={class:"subheading font-weight-regular"};function fr(e,t,n,r,o,a){const l=(0,s.up)("router-link");return(0,s.wg)(),(0,s.iD)(s.HY,null,[pr,(0,s._)("p",wr,[(0,s.Uk)(" Вибачте, але сторінку, яку ви шукаєте, не існує. Перейдіть "),(0,s.Wm)(l,{to:"/"},{default:(0,s.w5)((()=>[(0,s.Uk)("на головну сторінку")])),_:1}),(0,s.Uk)(". ")])],64)}var _r={name:"NotFoundPage"};const br=(0,S.Z)(_r,[["render",fr]]);var vr=br;const kr=(0,o.p7)({history:(0,o.PO)(),routes:[{path:"/",component:O},{path:"/login",component:ae},{path:"/profile/:id",component:Oe},{path:"/profile",component:Oe},{path:"/create",component:dt},{path:"/rides",component:Et},{path:"/rides/:id",component:Un},{path:"/reservations",component:gr},{path:"/:pathMatch(.*)*",component:vr}]}),yr=(0,r.ri)(z);yr.use(kr),yr.mount("#app")}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var s=t[r]={exports:{}};return e[r](s,s.exports,n),s.exports}n.m=e,function(){var e=[];n.O=function(t,r,o,s){if(!r){var a=1/0;for(u=0;u<e.length;u++){r=e[u][0],o=e[u][1],s=e[u][2];for(var l=!0,i=0;i<r.length;i++)(!1&s||a>=s)&&Object.keys(n.O).every((function(e){return n.O[e](r[i])}))?r.splice(i--,1):(l=!1,s<a&&(a=s));if(l){e.splice(u--,1);var c=o();void 0!==c&&(t=c)}}return t}s=s||0;for(var u=e.length;u>0&&e[u-1][2]>s;u--)e[u]=e[u-1];e[u]=[r,o,s]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={826:0};n.O.j=function(t){return 0===e[t]};var t=function(t,r){var o,s,a=r[0],l=r[1],i=r[2],c=0;if(a.some((function(t){return 0!==e[t]}))){for(o in l)n.o(l,o)&&(n.m[o]=l[o]);if(i)var u=i(n)}for(t&&t(r);c<a.length;c++)s=a[c],n.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return n.O(u)},r=self["webpackChunkblablacar"]=self["webpackChunkblablacar"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var r=n.O(void 0,[998],(function(){return n(2324)}));r=n.O(r)})();
//# sourceMappingURL=index.ceef8b01.js.map