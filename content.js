(function () {
  var uid = '';

  var comments = [];
  var classifiedIdValue = '';
  var commentInput = '';
  var commentList = '';
  var commentAllList = '';
  var endpointURL = 'https://jsonbox.io/box_1886f775b942349a1253';

  var hidePasswordIMGPath = ''
  var showPasswordIMGPath = '';
  var loadingSpinnerGIFPath = '';

  endpointURL = 'https://us-central1-fabled-mystery-287411.cloudfunctions.net';

  function initializeFirebase() {
    var firebaseConfig = {
      apiKey: "AIzaSyAo6MWl221WIPS4kgWlnhN6Pwc3ds3NACA",
      projectId: "fabled-mystery-287411",
      appId: "1:5295666268:web:aa5756f98137ec038ea299",
    };

    while (firebase == null) {

    }

    firebase
      .initializeApp(firebaseConfig);

    firebase
      .auth();

    firebase
      .auth()
      .onAuthStateChanged((user) => {
        var nonMemberDetails = document.querySelector('.custom-comments-nonmember-details');
        var memberDetails = document.querySelector('.custom-comments-member-details');

        if (user) {

        } else {

        }

        uid = user ? user.uid : '';

        nonMemberDetails.style.display = user ? 'none' : 'block';
        memberDetails.style.display = user ? 'block' : 'none';

        memberDetails.querySelector('.custom-comments-member-email').innerText = user ? user.email : '';

        loadComments();
      });
  }

  function showHidePassword(e) {

    e.target.previousElementSibling.type = (e.target.previousElementSibling.type == 'text' ? 'password' : 'text');

    if (e.target.previousElementSibling.type == 'text') {
      e.target.style.backgroundImage = "url('" + showPasswordIMGPath + "')";
    } else {
      e.target.style.backgroundImage = "url('" + hidePasswordIMGPath + "')";
    }
  }

  function closeModal(e) {
    document.querySelector('.custom-comments-login-wrapper').style.display = 'none';
    document.querySelector('.custom-comments-register-wrapper').style.display = 'none';
    document.querySelector('.custom-comments-reset-wrapper').style.display = 'none';
    document.querySelector('.custom-comments-all-comments-wrapper').style.display = 'none';

    document.querySelector('.custom-comments-modal-background').style.display = 'none';
  }

  function changeTab(e) {
    var liCustomCommentEl = e.target.parentElement;

    if (liCustomCommentEl.classList.contains('tab-custom-comments') == true) {
      if (liCustomCommentEl.classList.contains('active') == false) {
        document.querySelectorAll('.mini-tab ul li').forEach((el) => { el.classList.remove('active'); });
        document.querySelectorAll('.mini-tab-content').forEach((el) => { el.style.display = 'none'; });

        document.querySelector('.mini-tab ul li.tab-custom-comments').classList.add('active');
        document.querySelector('.custom-comments').style.display = 'block';
      }
    } else {
      document.querySelector('.mini-tab ul li.tab-custom-comments').classList.remove('active');
      document.querySelector('.custom-comments').style.display = 'none';
    }

    // jquery entegre edilirse çalışır
    /*
    $("html,body").animate({
      scrollTop: document.querySelector('.mini-tab ul li.tab-custom-comments').parentElement.offsetTop - 10
    }, 600);	
    */
  }

  function showLogin(e) {
    document.querySelector('.custom-comments-login-wrapper').style.display = 'block';
    document.querySelector('.custom-comments-register-wrapper').style.display = 'none';
    document.querySelector('.custom-comments-reset-wrapper').style.display = 'none';

    document.querySelector('.custom-comments-modal-background').style.display = 'block';
    document.querySelector('#txtCCLEmail').focus();
  }

  function showRegister(e) {
    document.querySelector('.custom-comments-login-wrapper').style.display = 'none';
    document.querySelector('.custom-comments-register-wrapper').style.display = 'block';
    document.querySelector('.custom-comments-reset-wrapper').style.display = 'none';

    document.querySelector('.custom-comments-modal-background').style.display = 'block';
    document.querySelector('#txtCCREmail').focus();
  }

  function showReset(e) {
    document.querySelector('.custom-comments-login-wrapper').style.display = 'none';
    document.querySelector('.custom-comments-register-wrapper').style.display = 'none';
    document.querySelector('.custom-comments-reset-wrapper').style.display = 'block';

    document.querySelector('.custom-comments-modal-background').style.display = 'block';
    document.querySelector('#txtCCRSEmail').focus();
  }

  function processLoadingSpinner(show, el) {

    if (show) {
      el.setAttribute('disabled', 'disabled');
      el.style.backgroundImage = "url('" + loadingSpinnerGIFPath + "')";
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = '96%';
      el.style.cursor = 'not-allowed';
    }
    else {
      el.removeAttribute('disabled');
      el.style.backgroundImage = '';
      el.style.backgroundRepeat = '';
      el.style.backgroundPosition = '';
      el.style.cursor = 'default';
    }
  }

  function login(e) {
    var email = document.querySelector('input[name="txtCCLEmail"]');
    var pass = document.querySelector('input[name="txtCCLPass"]');
    var info = document.querySelector('.custom-comments-login-info');
    var submitButton = e.target;

    info.innerText = '';

    if (email.value == '' || email.value.indexOf('.') == -1 || !email.value.indexOf('@') == -1) {
      setInfoDescription(info, 'E-Posta adresi hatalı!', 'error');
      return;
    }

    if (pass.value.length <= 5) {
      setInfoDescription(info, 'Şifre bilgisi hatalı, lütfen en az 6 hane giriniz!', 'error');
      return;
    }

    processLoadingSpinner(true, submitButton);

    firebase.auth()
      .signInWithEmailAndPassword(email.value, pass.value)
      .then((result) => {
        var user = result.user;

        processLoadingSpinner(false, submitButton);

        if (user.emailVerified == false) {
          setInfoDescription(info, 'E-Posta adresiniz doğrulanmamış!', 'error');
        } else {
          setInfoDescription(info, 'Giriş başarılı, lütfen bekleyiniz.', 'success');
        }

        setTimeout(() => {
          closeModal();

          email.value = ''
          pass.value = '';
          setInfoDescription(info, '', 'error');
        }, 1200);

      })
      .catch((error) => {
        processLoadingSpinner(false, submitButton);

        if (error.code == 'auth/invalid-email') {
          setInfoDescription(info, 'E-Posta adresi hatalı!', 'error');
        }

        if (error.code == 'auth/wrong-password') {
          setInfoDescription(info, 'Şifre hatalı!', 'error');
        }

        if (error.code == 'auth/user-not-found') {
          setInfoDescription(info, 'Hesap bulunamadı!', 'error');
        }

        if (error.code == 'auth/user-disabled') {
          setInfoDescription(info, 'Hesap askıya alınmış!', 'error');
        }
      });
  }

  function register(e) {
    var email = document.querySelector('input[name="txtCCREmail"]');
    var pass = document.querySelector('input[name="txtCCRPass"]');
    var pass2 = document.querySelector('input[name="txtCCRPass2"]');
    var info = document.querySelector('.custom-comments-register-info');
    var submitButton = e.target;

    info.innerText = '';

    if (email.value == '' || email.value.indexOf('.') == -1 || !email.value.indexOf('@') == -1) {
      setInfoDescription(info, 'E-Posta adresi hatalı!', 'error');
      return;
    }

    if (pass.value.length <= 5) {
      setInfoDescription(info, 'Şifre bilgisi hatalı, lütfen en az 6 hane giriniz!', 'error');
      return;
    }

    if (pass.value != pass2.value) {
      setInfoDescription(info, 'Şifre ve Şifre tekrar aynı değil!', 'error');
      return;
    }

    processLoadingSpinner(true, submitButton);

    firebase.auth()
      .createUserWithEmailAndPassword(email.value, pass.value)
      .then((result) => {
        var user = result.user;

        if (user.emailVerified == false) {
          sendUserEmailVerification();
        }

        processLoadingSpinner(false, submitButton);
        setInfoDescription(info, 'Kayıt başarılı, e-posta adresinize doğrulama linki gönderildi!', 'success');
        email.value = '';
        pass.value = '';
        pass2.value = '';
      })
      .catch((error) => {
        processLoadingSpinner(false, submitButton);

        if (error.code == 'auth/email-already-in-use') {
          setInfoDescription(info, 'Bu E-Posta adresi kullanımda!', 'error');
        }

        if (error.code == 'auth/invalid-email') {
          setInfoDescription(info, 'E-Posta adresi hatalı!', 'error');
        }

        if (error.code == 'auth/operation-not-allowed') {
          setInfoDescription(info, 'Hesap askıya alınmış!', 'error');
        }

        if (error.code == 'auth/weak-password') {
          setInfoDescription(info, 'Şifre bilgisi hatalı, en az 6 karakter giriniz!', 'error');
        }

        // auth/email-already-in-use
        // auth/invalid-email
        // auth/operation-not-allowed
        // auth/weak-password
      });
  }

  function reset(e) {
    var email = document.querySelector('input[name="txtCCRSEmail"]');
    var info = document.querySelector('.custom-comments-reset-info');
    var submitButton = e.target;

    info.innerText = '';

    if (email.value == '' || email.value.indexOf('.') == -1 || !email.value.indexOf('@') == -1) {
      setInfoDescription(info, 'E-Posta adresi hatalı!', 'error');
      return;
    }

    processLoadingSpinner(true, submitButton);

    try {
      firebase
        .auth()
        .sendPasswordResetEmail(email.value)
        .then((result) => {
          processLoadingSpinner(false, submitButton);

          setInfoDescription(info, 'E-posta adresinize şifre sıfırlama linki gönderilmiştir.', 'success');

          setTimeout(() => {
            closeModal();

            email.value = ''
            setInfoDescription(info, '', 'error');
          }, 1200);

          console.log(result, 'sendPasswordResetEmail.success');
        })
        .catch((error) => {
          processLoadingSpinner(false, submitButton);

          if (error.code == 'auth/user-not-found') {
            setInfoDescription(info, 'Hesap bulunamadı!', 'error');
          }

          if (error.code == 'auth/invalid-email') {
            setInfoDescription(info, 'E-Posta adresi hatalı!', 'error');
          }

          console.log(error, 'sendPasswordResetEmail.error');
        });
    } catch (error) {
      processLoadingSpinner(false, submitButton);
      setInfoDescription(info, 'Bir hata oluştu!', 'error');
      console.log(error);
    }
  }

  function setInfoDescription(el, text, type) {
    el.classList.remove('success');
    el.classList.remove('error');

    el.classList.add(type);

    el.innerText = text;
  }

  function sendUserEmailVerification() {
    firebase
      .auth()
      .currentUser
      .sendEmailVerification()
      .then((result) => {
        console.log(result, 'sendEmailVerification.success');
      })
      .catch((error) => {
        console.log(error, 'sendEmailVerification.error');
      });
  }

  function comment(e) {
    commenInfo.innerText = '';
    commenInfo.style.display = 'none';

    if (commentInput.value == '') {
      commenInfo.innerText = 'Yorum göndermek için, yorum yazmalısınız!'
      commenInfo.style.display = 'inline-block';
      commentInput.focus();
      return;
    }

    if (uid == '') {
      commenInfo.innerText = 'Yorum göndermek için, giriş yapmalısınız!'
      commenInfo.style.display = 'inline-block';
      return;
    }

    var data = {
      'uid': uid,
      'classifiedId': classifiedIdValue,
      'comment': commentInput.value
    }

    processLoadingSpinner(true, commentSubmit);
    sendRequest(endpointURL + '/setComment', JSON.stringify(data), 'post', commentResult);
  }

  function commentResult(result) {
    try {
      var result = JSON.parse(result.responseText);

      processLoadingSpinner(false, commentSubmit);

      if (result.success == true) {
        commentInput.value = '';
        loadComments();
      } else {
        commenInfo.innerText = result.message;
        commenInfo.style.display = 'inline-block';
      }
    } catch (error) {
      commenInfo.innerText = error;
      commenInfo.style.display = 'inline-block';
      processLoadingSpinner(false, commentSubmit);
    }
  }

  function loadComments() {
    var data = {
      'classifiedId': classifiedIdValue
    }

    commentList.innerHTML = '';
    commentList.style.background = "url('" + loadingSpinnerGIFPath + "') no-repeat center";

    sendRequest(endpointURL + '/getComments', JSON.stringify(data), 'post', loadCommentsResult);
  }

  function loadCommentsResult(result) {
    try {
      // todo spinner
      var result = JSON.parse(result.responseText);

      commentList.style.background = '';

      if (result.success) {
        comments = result.message;

        document.querySelector('.custom-comments-no-comment-message').style.display = comments.length > 0 ? 'none' : 'block';

        commentList.style.display = comments.length > 0 ? 'block' : 'none';
        
        if (comments.length > 0) {
          commentList.innerHTML = comments.map((el) => '<li class="custom-comments-list-item"><div class="custom-comments-comment">' + el.comment + '</div><div class="custom-comments-comment-member">' + el.email + ' - ' + new Date(el.created_at).toLocaleString() + '</div></li>').join('');

          if (uid != '') {
            colorLatestComment();
          }
        }
      }
    } catch (error) {

    }
  }

  function loadAllComments() {
    var data = {
      'uid': uid
    }

    document.querySelector('.custom-comments-all-comments-wrapper').style.display = 'block';
    document.querySelector('.custom-comments-modal-background').style.display = 'block';

    commentAllList.innerHTML = '';
    commentAllList.style.background = "url('" + loadingSpinnerGIFPath + "') no-repeat center";

    sendRequest(endpointURL + '/getAllComments', JSON.stringify(data), 'post', loadAllCommentsResult);
  }

  function loadAllCommentsResult(result) {
    try {
      var result = JSON.parse(result.responseText);

      if (result.success) {
        comments = result.message;

        commentAllList.style.display = comments.length > 0 ? 'block' : 'none';
        commentAllList.style.background = '';

        if (comments.length > 0) {
          commentAllList.innerHTML = comments.map((el) => '<li class="custom-comments-all-comments-list-item"><a target="_blank" href="https://sahibinden.com/' + el.classifiedId + '">İlan No:' + el.classifiedId + '</a></li>').join('');
        } else {
          commentAllList.innerHTML = '<li class="custom-comments-all-comments-list-item">Kayıt bulunamadı!</li>'
        }
      }
    } catch (error) {

    }
  }

  function logout() {
    try {
      firebase
        .auth()
        .signOut();
    } catch (error) {

    }
  }

  function colorLatestComment() {
    var color = 'rgb(204, 239, 164, {opacity})';
    var opacity = 1;

    var colorLatestCommentInterval = setInterval(() => {
      if (opacity <= 0) {
        clearInterval(colorLatestCommentInterval);
        return;
      }

      opacity -= .1;

      commentList.children[0].style.backgroundColor = color.replace(/{opacity}/g, opacity);
    }, 200);
  }

  function sendRequest(url, data, method, callback) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
      if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
        callback(req);
      }
    }

    req.onerror = function (e) {
      callback(req);
    }

    req.open(method, url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(data);
  }

  function createCustomCommentsTabUI() {
    var tabsUL = document.querySelector('ul.classifiedDetailTabs');
    var tabsContent = document.querySelector('.classifiedOtherDetails');

    if (tabsUL != null) {
      var tabCommentLi = document.createElement('li');
      var tabCommentA = document.createElement('a');

      var tabCommentContent = document.createElement('div');

      tabCommentLi.className = 'tab-custom-comments';

      tabCommentA.href = '#custom-comments';
      tabCommentA.innerText = 'Yorumlar';

      tabCommentContent.className = 'custom-comments mini-tab-content';
      tabCommentContent.style.display = 'none';
      tabCommentContent.innerHTML = `
      <div class="custom-comments-area-wrapper">
      <div class="custom-comments-list-header">
        Bu topluluk sizlerin sayesinde varolmaktadır, lütfen küfür, argo ve şiddet içeren yorumlarda bulunmayınız!
      </div>
      <div class="custom-comments-modal-background"></div>
      <div class="custom-comments-comment-area">
        <div>
          <input type="text" name="txtCCComment" class="custom-comments-comment-input" placeholder="Yorum..." autocomplete="off" />
          <button class="custom-comments-comment-send">Gönder</button>
          <div class="custom-comments-member-indicator">
            <div class="custom-comments-member-details">
              <span class="custom-comments-member-email"></span>
              <ul class="custom-comments-member-details-list">
                <li class="custom-comments-member-details-list-item"><a href="javascript:;" class="custom-comments-member-all-comments">Tüm Yorumlarım</a></li>
                <li class="custom-comments-member-details-list-item"><a href="javascript:;" class="custom-comments-member-logout">Çıkış</a></li>
              </ul>
            </div>
            <div class="custom-comments-nonmember-details">
              <div class="custom-comments-member-login">
                <a href="javascript:;">Giriş Yap</a>
              </div>
              &nbsp;/
              <div class="custom-comments-member-register">
                <a href="javascript:;">Kayıt Ol</a>
              </div>
            </div>
          </div>
        </div>
        <div class="custom-comments-comment-info error"></div>
      </div>
      <div class="custom-comments-login-wrapper">
        <div class="custom-comments-modal-close"><a href="javascript:;">Kapat</a></div>
        <form class="custom-comments-login-form" name="custom-comments-login-form">
          <div class="custom-comments-login-email custom-comments-login-item">
            <label for="txtCCLEmail">E-Posta Adresi:</label>
            <input type="email" name="txtCCLEmail" id="txtCCLEmail" autocomplete="off" />
          </div>
          <div class="custom-comments-login-pass custom-comments-login-item">
            <label for="txtCCLPass">Şifre:</label>
            <a class="custom-comments-member-reset" href="javascript:;">Şifremi unuttum</a>
            <input type="password" name="txtCCLPass" id="txtCCLPass"/>
            <span class="custom-comments-show-password"></span>
          </div>
            <div class="custom-comments-login-submit custom-comments-login-item">
            <div class="custom-comments-login-info"></div>  
            <input type="button" name="submit" value="Giriş Yap" />
          </div>
        </form>
      </div>
      <div class="custom-comments-register-wrapper">
        <div class="custom-comments-modal-close"><a href="javascript:;">Kapat</a></div>
        <form class="custom-comments--register-form" name="custom-comments-register-form">
          <div class="custom-comments-register-email custom-comments-register-item">
            <label for="txtCCREmail">E-Posta Adresi:</label>
            <input type="email" name="txtCCREmail" id="txtCCREmail" autocomplete="off"/>
          </div>
          <div class="custom-comments-register-pass custom-comments-register-item">
            <label for="txtCCRPass">Şifre:</label>
            <input type="password" name="txtCCRPass" id="txtCCRPass"/>
            <span class="custom-comments-show-password"></span>
          </div>
          <div class="custom-comments-register-pass custom-comments-register-item">
            <label for="txtCCRPass2">Şifre Tekrar:</label>
            <input type="password" name="txtCCRPass2" id="txtCCRPass2"/>
            <span class="custom-comments-show-password"></span>
          </div>
          <div class="custom-comments-register-submit custom-comments-register-item">
            <div class="custom-comments-register-info"></div>
            <input type="button" name="submit" value="Kayıt Ol" />
          </div>
        </form>
      </div>
      <div class="custom-comments-reset-wrapper">
        <div class="custom-comments-modal-close"><a href="javascript:;">Kapat</a></div>
        <form class="custom-comments-reset-form" name="custom-comments-reset-form">
          <div class="custom-comments-reset-email custom-comments-reset-item">
            <label for="txtCCREmail">E-Posta Adresi:</label>
            <input type="email" name="txtCCRSEmail" id="txtCCRSEmail" autocomplete="off"/>
          </div>
          <div class="custom-comments-reset-submit custom-comments-reset-item">
            <div class="custom-comments-reset-info"></div>
            <input type="button" name="submit" value="Şifre Sıfırla!" />
          </div>
        </form>
      </div>
      <div class="custom-comments-all-comments-wrapper">
        <div class="custom-comments-modal-close"><a href="javascript:;">Kapat</a></div>
        <div class="custom-comments-all-comments-header">Tüm Yorumlar</div>
        <ul class="custom-comments-all-comments-list"></ul>
      </div>
      <div class="custom-comments-no-comment-message">Bu ilana henüz yorum yapılmamış</div>
      <div class="custom-comments-list-wrapper">
        <ul class="custom-comments-list"></ul>
      </div>
    </div>`;

      tabCommentLi.appendChild(tabCommentA);
      tabsUL.appendChild(tabCommentLi)

      tabsContent.insertBefore(tabCommentContent, document.querySelectorAll('.mini-tab-content')[document.querySelectorAll('.mini-tab-content').length - 1].nextElementSibling);

      if (loadingSpinnerGIFPath == '') {
        loadingSpinnerGIFPath = chrome.runtime.getURL('assets/ajax-loader.gif');
      }

      if (hidePasswordIMGPath == '') {
        hidePasswordIMGPath = chrome.runtime.getURL('assets/password_hide.png');
        showPasswordIMGPath = chrome.runtime.getURL('assets/password_show.png');
      }

      classifiedIdValue = document.querySelector('input#classifiedIdValue').value;

      commentInput = document.querySelector('input[name="txtCCComment"]');
      commentSubmit = document.querySelector('.custom-comments-comment-send');
      commenInfo = document.querySelector('.custom-comments-comment-info');
      commentList = document.querySelector('.custom-comments-list');
      commentAllList = document.querySelector('.custom-comments-all-comments-list');

      document.querySelector('.custom-comments-member-login a').addEventListener('click', showLogin);
      document.querySelector('.custom-comments-member-register a').addEventListener('click', showRegister);
      document.querySelector('.custom-comments-member-reset').addEventListener('click', showReset);

      document.querySelector('.custom-comments-login-submit').addEventListener('click', login);
      document.querySelector('.custom-comments-register-submit').addEventListener('click', register);
      document.querySelector('.custom-comments-reset-submit').addEventListener('click', reset);

      document.querySelector('.custom-comments-comment-send').addEventListener('click', comment);

      document.querySelectorAll('.custom-comments-modal-close').forEach((el) => { el.addEventListener('click', closeModal) });
      document.querySelectorAll('ul.classifiedDetailTabs li').forEach((el) => { el.addEventListener('click', changeTab); })

      document.querySelectorAll('.custom-comments-show-password').forEach((el) => { el.style.backgroundImage = "url('" + showPasswordIMGPath + "')"; el.addEventListener('click', showHidePassword); })

      document.querySelector('.custom-comments-member-all-comments').addEventListener('click', loadAllComments);
      document.querySelector('.custom-comments-member-logout').addEventListener('click', logout);

      setTimeout(() => {
        initializeFirebase();
      }, 600);



      // <input type="hidden" value="677191992" id="classifiedIdValue">
      // <input type="hidden" value="677191992" id="counter_classifiedId">
      // <input type="hidden" value="677191992" id="attrClassifiedId">
      // <span class="classifiedId" id="classifiedId">677191992</span>
    }
  }

  createCustomCommentsTabUI();
})();