<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Trình xem Hán tự</title>
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/kanjiViewer.css">
    <link rel="stylesheet" href="/css/components.css">
    <script type="module" src="/src/kanjiDict.js"></script>
</head>

<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/includes/header.php'; ?>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/includes/navigation.php'; ?>

    <main>
        <form method="get" class="search-form">
            <input type="text" name="kanji" placeholder="Tìm kiếm Hán tự" required />
            <button type="submit">Tìm kiếm</button>
        </form>
        <!-- ここに漢字の情報が表示されます -->
        <div id="kanji-output">
            <div id="kanji-output__img--stroke"></div>
            <div id="kanji-output__practice"></div>
            <div id="kanji-output__img--parts"></div>

        </div>
        <div id="test-container"></div>
    </main>




    <?php include $_SERVER['DOCUMENT_ROOT'] . '/includes/footer.php'; ?>
    <script type=" module">
        // ここでURLの ?kanji=... を処理する予定
        const params = new URLSearchParams(window.location.search);
        const kanji = params.get("kanji");
        if (kanji) {
            console.log("検索された漢字:", kanji);
            // 後でここにJSの処理を追加します
        }
    </script>
</body>

</html>