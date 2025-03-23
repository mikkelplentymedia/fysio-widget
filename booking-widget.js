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

    // Byg billedgalleri
    const pictures = data.pictures || [];
    let galleryHTML = "";

    if (pictures.length > 0) {
      const firstImage = pictures[0].url;
      const otherImages = pictures.slice(1, 3); // maks 2 billeder til højre

      galleryHTML += `
        <div class="gallery-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; padding: 0 64px 32px 64px; align-items: stretch;">
          <div class="gallery-main" style="aspect-ratio: 1 / 1; height: 100%; width: 100%; overflow: hidden; border-radius: 8px; position: relative;">
            <img src="${firstImage}" data-full="${firstImage}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 8px; cursor: pointer;" />
          </div>
          <div class="gallery-side" style="display: flex; flex-direction: column; gap: 10px;">
      `;

      otherImages.forEach((img) => {
        galleryHTML += `
          <div style="aspect-ratio: 1 / 1; width: 100%; overflow: hidden; border-radius: 8px; position: relative;">
            <img src="${img.url}" data-full="${img.url}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 8px; cursor: pointer;" />
          </div>`;
      });

      galleryHTML += `</div></div>`;
    }

    // Byg info-boksen
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

    // Lightbox-styling + funktion
    const lightboxScript = `
      <style>
        .lightbox-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .lightbox-backdrop img {
          max-width: 90%;
          max-height: 90%;
          border-radius: 8px;
        }
      </style>
      <script>
        document.querySelectorAll("#hold-booking-widget img[data-full]").forEach(img => {
          img.addEventListener("click", () => {
            const backdrop = document.createElement("div");
            backdrop.className = "lightbox-backdrop";
            const fullImg = document.createElement("img");
            fullImg.src = img.getAttribute("data-full");
            backdrop.appendChild(fullImg);
            backdrop.addEventListener("click", () => backdrop.remove());
            document.body.appendChild(backdrop);
          });
        });
      </script>
    `;

    // Kombinér og vis
    container.innerHTML = galleryHTML + infoHTML + lightboxScript;
  } catch (error) {
    console.error("Fejl:", error);
    container.innerHTML = "<p>❌ Kunne ikke hente holdoplysninger.</p>";
  }
});
