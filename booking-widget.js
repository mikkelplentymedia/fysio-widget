document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("hold-booking-widget");
  if (!container) return;

  const recordId = container.getAttribute("data-recordid");
  if (!recordId) {
    container.innerHTML = "<p>❌ Mangler recordId.</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://celadon-toffee-953b1f.netlify.app/.netlify/functions/getHoldData?recordId=${recordId}`
    );
    const data = await response.json();

    if (data.error) {
      container.innerHTML = `<p>❌ Kunne ikke hente holdoplysninger.</p>`;
      return;
    }

    // Billedgalleri
    const pictures = data.pictures || [];
    let galleryHTML = "";

    if (pictures.length > 0) {
      const firstImage = pictures[0].url;
      const otherImages = pictures.slice(1, 3); // max 2 i sidekolonne

      galleryHTML += `
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; padding: 0 64px 32px 64px;">
          <div>
            <img src="${firstImage}" alt="Galleri billede" class="lightbox-img" style="width: 100%; height: auto; border-radius: 8px; cursor: pointer;" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${otherImages
              .map(
                (img) =>
                  `<img src="${img.url}" alt="Galleri billede" class="lightbox-img" style="width: 100%; height: auto; border-radius: 8px; cursor: pointer;" />`
              )
              .join("")}
          </div>
        </div>
      `;
    }

    // Info-boks
    const infoHTML = `
      <div style="font-family: sans-serif; border:1px solid #ccc; padding:20px 64px; border-radius:8px;">
        <h2>${data.team_name}</h2>
        <p><strong>Dato:</strong> ${new Date(data.datetime).toLocaleString("da-DK")}</p>
        <p><strong>Instruktør:</strong> ${data.instructor_name}</p>
        <p><strong>Pris:</strong> ${data.price} DKK</p>
        <p><strong>Beskrivelse:</strong> ${data.description}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Max deltagere:</strong> ${data.max_participants}</p>
      </div>
    `;

    // Lightbox-styling og funktionalitet
    const lightboxScript = `
      <style>
        .lightbox-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .lightbox-overlay img {
          max-width: 90%;
          max-height: 90%;
          border-radius: 8px;
        }
      </style>
      <script>
        document.querySelectorAll('.lightbox-img').forEach((img) => {
          img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';
            overlay.innerHTML = '<img src="' + img.src + '" /><div style="position:absolute;top:20px;right:30px;font-size:2rem;color:white;cursor:pointer;">×</div>';
            overlay.addEventListener('click', () => document.body.removeChild(overlay));
            document.body.appendChild(overlay);
          });
        });
      </script>
    `;

    // Indsæt galleri + info + lightbox-script
    container.innerHTML = galleryHTML + infoHTML + lightboxScript;
  } catch (error) {
    console.error("Fejl:", error);
    container.innerHTML = "<p>❌ Kunne ikke hente holdoplysninger.</p>";
  }
});
