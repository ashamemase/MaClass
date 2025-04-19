<nav id="globalnavi">
  <button id="menu-toggle">☰</button>
  <ul id="nav-links">
    <li><a href="/index.php">Trang chủ</a></li>
    <li><a href="/about.php">Về trang web</a></li>
    <li><a href="/search.php">Tìm kiếm bài học</a></li>
    <li><a href="/pages/auth/register.php">Đăng ký</a></li>
  </ul>
</nav>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menu-toggle');
    const links = document.getElementById('nav-links');
    toggle.addEventListener('click', () => {
      links.classList.toggle('show');
    });
  });
</script>