<?php
require_once __DIR__ .'/db.php'; // DB接続

$formats = [
    'jft_q_1_1' => 4,
    'jft_q_1_2' => 4,
    'jft_q_1_3' => 3,
    'jft_q_1_4' => 2,
    'jft_q_1_5' => 2
];

// 最終的な問題リスト
$allQuestions = [];

foreach ($formats as $table => $count) {
    // 各テーブルからランダムに何問か取る（例：2問ずつ）
    $stmt = $pdo->query("SELECT * FROM {$table} ORDER BY RAND() LIMIT {$count}");
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($questions as $q) {
        $one = [
            'id' => $q['id'],
            'table' => $table,
            'question' => $q['question'] ?? null, // questionカラムがある場合
            'image_path' => $q['image_path'] ?? null,
            'choices' => array_filter([$q['choice_1'] ?? null, $q['choice_2'] ?? null, $q['choice_3'] ?? null, $q['choice_4'] ?? null]),
            'correct_choice' => $q['correct_choice']
        ];
        $allQuestions[] = $one;
    }
}

// JSONエンコード
$json = json_encode($allQuestions, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

// 保存先ファイル名
$file = 'questions_section1.json';

// ファイルに書き込む
file_put_contents($file, $json);

echo "JSONファイルを生成しました！ファイル名: {$file}";
?>