<?php
session_start();
$logged_in = isset($_SESSION['user_id']); // ログイン状態判定
?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GateWay to Japanese</title>
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/components.css">
</head>
<body>

  <?php include("includes/header.php")?>
  <?php include("includes/navigation.php")?>
  <main>
    <!-- 共通のメインコンテンツ -->
    <?php include("includes/main-content.php"); ?>
  </main>

<!-- フッター -->
  <?php include("includes/footer.php")?>

</body>
  
</html>