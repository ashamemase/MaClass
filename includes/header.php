<?php
session_start(); 

// Remember Me の判定処理
if (!isset($_SESSION['user_id']) && (!isset($_SESSION['remember_checked']) || empty($_SESSION['remember_checked']))) {
  // ここで remember_token チェックを一度だけ行う
  if (isset($_COOKIE['remember_token'])) {
    require_once 'db_connect.php';
    $stmt = $pdo->prepare('SELECT user_id FROM remember_tokens WHERE token = ? AND expires_at >= NOW()');
    $stmt->execute([$_COOKIE['remember_token']]);
    $row = $stmt->fetch();

    if ($row) {
        $_SESSION['user_id'] = $row['user_id'];

        // 任意：ユーザー名も取っておく
        $stmt = $pdo->prepare('SELECT name FROM users WHERE id = ?');
        $stmt->execute([$row['user_id']]);
        $user = $stmt->fetch();
        $_SESSION['user_name'] = $user['name'] ?? '';
    }
  }

  // Rememberチェック完了フラグを立てる
  $_SESSION['remember_checked'] = true;
}

?>

<header id="header">
  <div class="header-container">
    <div class="logo">
      <a href="/index.php"><img src="/assets/img/banner.png" alt="Gateway To Japanese"></a>
    </div>

    <div class="login-box">
      <?php if (isset($_SESSION['user_name'])): ?>
        <!-- ログイン済み表示 -->
        <div class="row">
          <p>Xin chào, <?= htmlspecialchars($_SESSION['user_name']) ?>!</p>
          <a href="/pages/auth/logout.php">Đăng xuất</a>
        </div>
      <?php else: ?>
        <!-- ログインフォーム表示 -->
        <div class="row">
          <label class="id">Địa chỉ email&nbsp;<input type="text" name="loginId" id="loginId"></label>
          <input type="button" id="login" class="login_btn" name="login" onclick="window.headerLogin();" value="Đăng nhập">
        </div>
        <div class="row">
          <label class="ps">Mật khẩu&nbsp;<input type="password" name="password" id="password" onkeydown="if(event.keyCode==13){setTimeout(function () {document.getElementById('login').click();}, 500);return false;}"></label>
          <label class="login"><input type="checkbox" name="loginState" value="checked">&nbsp;Duy trì trạng thái đăng nhập</label>
        </div>
        <div class="row small-note">
          <span class="text">
            Nếu bạn quên thông tin, hãy nhấn <a href="/reminder/home">vào đây</a>.
          </span>
        </div>
      <?php endif; ?>
    </div>
  </div>
</header>