<?php
$host = 'localhost';
$user = 'root';
$password = 'm42974298'; // パスワード設定している場合はその値を入れてください
$dbname = 'test'; // 存在するデータベース名（たとえば 'test'）

// 接続
$conn = new mysqli($host, $user, $password, $dbname);

// 接続確認
if ($conn->connect_error) {
    die("接続失敗: " . $conn->connect_error);
}

echo "データベースに接続できました！";

$conn->close();
?>