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

    const pictures = data.pictures || [];
    let galleryHTML = "";

    if (pictures.length > 0) {
      const firstImage = pictures[0].url;
      const nextImages = pictures.slice(1, 3); // maks 2 ekstra

      galleryHTML += `
        <div class="gallery-wrapper">
          <div class="gallery-left">
            <img src="${firstImage}" alt="Galleri billede" onclick="openLightbox('${firstImage}')" />
          </div>
          <div class="gallery-right">
            ${nextImages
              .map(
                (img) =>
                  `<img src="${img.url}" alt="Galleri billede" onclick="openLightbox('${img.url}')" />`
              )
              .join("")}
          </div>
        </div>
      `;
    }

    const infoHTML = `
      <div style="font-family: sans-serif; border:1px solid #ccc; padding:20px 64px; border-radius:8px; margin-top: 24px;">
        <h2>${data.team_name}</h2>
        <p><strong>Dato:</strong> ${new Date(data.datetime).toLocaleString("da-DK")}</p>
        <p><strong>Instruktør:</strong> ${data.instructor_name}</p>
        <p><strong>Pris:</strong> ${data.price} DKK</p>
        <p><strong>Beskrivelse:</strong> ${data.description}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Max deltagere:</strong> ${data.max_participants}</p>
      </div>
    `;

    const styles = `
      <style>
        .gallery-wrapper {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 10px;
          padding: 0 64px;
        }
        .gallery-left img,
        .gallery-right img {
          width: 100%;
          border-radius: 8px;
          object-fit: cover;
          cursor: pointer;
        }
        .gallery-right {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        /* Lightbox styles */
        .lightbox {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0,0,0,0.9);
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .lightbox img {
          max-width: 90%;
          max-height: 90%;
          border-radius: 8px;
        }
      </style>
    `;

    const lightboxHTML = `
      <div class="lightbox" id="lightbox" onclick="closeLightbox()">
        <img id="lightbox-img" src="" alt="Fullscreen billede" />
      </div>
    `;

    container.innerHTML = styles + galleryHTML + infoHTML + lightboxHTML;
  } catch (error) {
    console.error("Fejl:", error);
    container.innerHTML = "<p>❌ Kunne ikke hente holdoplysninger.</p>";
  }
});

// Lightbox-funktioner
function openLightbox(imgUrl) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.src = imgUrl;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}
