<?php
$host = 'localhost';
$dbname = 'maclass';
$user = 'root';
$password = 'm42974298';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("接続エラー: " . $e->getMessage());
}
?>