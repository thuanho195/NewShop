$('.container__slider-primary').owlCarousel({
    loop:true,
    autoplay : true,
    margin:0,
    nav:false,
    responsive:{
    0:{
        items:1
    },
    600:{
        items:1
    },
    1000:{
        items:1
    }
}
});
$('.container-flashsale-body').owlCarousel({
    loop:true,
    autoplay : true,
    margin:24,
    nav:false,
    responsive:{
    0:{
        items:1
    },
    600:{
        items:1
    },
    1000:{
        items:3
    }
}
});
var btn = $('.back-to-top');

$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else { 
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});
const bd = document.getElementsByTagName('body');
const open = document.getElementById('btn-login');
const openmb = document.getElementById('btn-login-mb');
const openregister = document.getElementById('btn-register');
const openregistermb = document.getElementById('btn-register-mb');
const close = document.getElementById('close');
const closeregister = document.getElementById('close-register');
const container = document.getElementById('container');
const containerregister = document.getElementById('container-register');
open.onclick = function(){
    container.style.visibility = 'inherit';
}
openmb.onclick = function(){
  container.style.visibility = 'inherit';
}
bd.onclick = function(){
  container.style.visibility = 'hidden';
}
close.onclick = function(){
  container.style.visibility = 'hidden';
}
openregister.onclick = function(){
  containerregister.style.visibility = 'inherit';
}
openregistermb.onclick = function(){
  containerregister.style.visibility = 'inherit';
}
closeregister.onclick = function(){
  containerregister.style.visibility = 'hidden';
}

function Validator(options){
  var selectorRules = {};
  // hàm thực hiện hiện lỗi hoặc bỏ lỗi thông qua 2 đối số
  function Validate(inputElement, rule){
      var erroMessage;
      var formMessage = inputElement.parentElement.querySelector(options.erroSelector);  
      
      // lấy ra các rule của từng selector
      var rules =   selectorRules[rule.selector];

      //lặp qua từng rule và kiểm tra lỗi nếu có thì dừng việc kiểm tra
      for (var i = 0; i< rules.length; ++i){
         erroMessage = rules[i](inputElement.value);
         if(erroMessage) break;
      }
      if(erroMessage){
         formMessage.innerText = erroMessage;
         inputElement.parentElement.classList.add('error-register');
      } else {
          formMessage.innerText = '';
         inputElement.parentElement.classList.remove('error-register');
      }
      return !erroMessage;
  }
      // lấy element của form cần kiểm tra lỗi
  var formElement = document.querySelector(options.form);
  if(formElement){

      //tắt sự kiện bấm nút submit form
      formElement.onsubmit = function(e){
          e.preventDefault();
          var isFormValid = true;
          // thực hiện lặp qua từng rule và validate luôn
          options.rules.forEach(function(rule){
              var inputElement = formElement.querySelector(rule.selector);
              var isValid = Validate(inputElement, rule);
              if (!isValid){
                  isFormValid = false;
              }
          });
          if(isFormValid){

                  // trường hợp submit với javascript tạo bởi 1 function
              if(typeof options.onSubmit === 'function'){

                  var enableInputs = formElement.querySelectorAll('[name]');
                  var formValues =  Array.from(enableInputs).reduce(function(values , input){
                      return (values[input.name] = input.value) && values;
                  }, {});
                
                  options.onSubmit(formValues)
              }
                  // trường hợp submit với hành vi mặc đinhj
                  else{
                      formElement.submit();
                  }
          } 
      }

      //lặp qua từng rule của rules
     options.rules.forEach(function(rule){
          
      //lưu lại các rule cho mỗi input

          // kiểm tra nếu ko phải là mảng thì gáng mảng khởi tạo selectorRule là mảng rule.test
          // nếu đã là mãng thì push thêm ptu vao mảng
      if ( Array.isArray(selectorRules[rule.selector])){
          selectorRules[rule.selector].push(rule.test)
      } else {
          selectorRules[rule.selector] = [rule.test];
      }
    


         // tạo biến inputelement = selector từ form được chọn
      var inputElement = formElement.querySelector(rule.selector);
      
      if(inputElement){
          // kiểm tra sự kiện onblur
          inputElement.onblur = function(){
              // gọi lại hàm valide để kiểm tra lỗi 
              Validate(inputElement, rule);
             
          }
          // khi người dùng nhập thì xóa lỗi
          inputElement.oninput = function(){
              var formMessage = inputElement.parentElement.querySelector(options.erroSelector);   
              formMessage.innerText = '';
              inputElement.parentElement.classList.remove('error-register');
          }
      }
     });
  }
}

// Định nghĩa các rules ở bên file index
//nguyên tắc của các rule
//1 khi có lỗi thì trả ra mesage lỗi
// 2 khi ko có lỗi thì không trả ra cái gì cả undefied
Validator.isRequired = function(selector){
  return{
      selector : selector,
      test : function(value){
          return value.trim() ? undefined : 'Vui lòng nhập trường này';
      }
  }
}
Validator.isEmail = function(selector){
 return{
      selector : selector,
      test : function(value){
          var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regex.test(value) ? undefined : 'Trường này phải là email';
      }
  }
}
Validator.minLength = function(selector , min){
  return {
      selector : selector,
      test : function(value){
          return value.length >= min ? undefined : `Vui lòng nhâp tối thiểu ${min} kí tự`;
      }
  }
}
Validator.isConfirmed = function(selector, getConfirmValue, message){
  return {
      selector : selector,
      test : function(value){
          return value === getConfirmValue() ? undefined :message ||'Dữ liệu nhập vào không chính xác';
      }
  }
}