function mostrar(id) {
      ['statusLoading','statusError','statusInfo','resultCard'].forEach(i => {
        const el = document.getElementById(i);
        if (i === 'resultCard') el.classList.remove('visible');
        else el.style.display = 'none';
      });
      const el = document.getElementById(id);
      if (id === 'resultCard') el.classList.add('visible');
      else el.style.display = id === 'statusLoading' ? 'flex' : 'block';
    }

    function ocultarTodo() {
      ['statusLoading','statusError','statusInfo','resultCard'].forEach(i => {
        const el = document.getElementById(i);
        if (i === 'resultCard') el.classList.remove('visible');
        else el.style.display = 'none';
      });
    }

    async function procesar() {
      const url = document.getElementById('urlInput').value.trim();

      if (!url) {
        document.getElementById('statusError').textContent = '⚠️ Por favor pega un enlace de TikTok.';
        mostrar('statusError');
        return;
      }

      if (!url.includes('tiktok.com') && !url.includes('vm.tiktok.com')) {
        document.getElementById('statusError').textContent = '⚠️ El enlace debe ser de TikTok (tiktok.com).';
        mostrar('statusError');
        return;
      }

      document.getElementById('btnDescargar').disabled = true;
      mostrar('statusLoading');

      try {
        const apiUrl = 'https://www.tikwm.com/api/?url=' + encodeURIComponent(url);
        const resp = await fetch(apiUrl);
        const data = await resp.json();

        if (data.code === 0 && data.data) {
          const d = data.data;
          document.getElementById('videoTitle').textContent = d.title || 'Video de TikTok';
          document.getElementById('videoAuthor').textContent = '@' + (d.author?.unique_id || 'usuario');

          const base = 'https://www.tikwm.com';
          document.getElementById('btnHD').href = base + (d.play || d.wmplay);
          document.getElementById('btnOriginal').href = base + (d.wmplay || d.play);

          mostrar('resultCard');
        } else {
          document.getElementById('statusError').textContent =
            '❌ No se pudo procesar el video. Asegúrate de que sea un video público y el enlace sea correcto.';
          mostrar('statusError');
        }
      } catch (err) {
        document.getElementById('statusError').textContent =
          '❌ Error de red. Verifica tu conexión e intenta de nuevo.';
        mostrar('statusError');
      } finally {
        document.getElementById('btnDescargar').disabled = false;
      }
    }

    document.getElementById('urlInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') procesar();
    });