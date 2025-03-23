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
    let lightboxScripts = "";

    if (pictures.length > 0) {
      const firstImage = pictures[0].url;
      const otherImages = pictures.slice(1, 3); // max 2

      galleryHTML += `
        <div class="gallery-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; padding: 0 64px 32px 64px;">
          <div class="gallery-main" style="aspect-ratio: 1 / 1; width: 100%; overflow: hidden; border-radius: 8px; position: relative;">
            <img src="${firstImage}" data-full="${firstImage}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 8px; cursor: pointer;" />
          </div>
          <div class="gallery-side" style="display: flex; flex-direction: column; gap: 10px; height: 100%;">
            ${otherImages
              .map(
                (img) => `
                <div style="aspect-ratio: 1 / 1; width: 100%; overflow: hidden; flex: 1; border-radius: 8px;">
                  <img src="${img.url}" data-full="${img.url}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 8px; cursor: pointer;" />
                </div>
              `
              )
              .join("")}
          </div>
        </div>
      `;

      lightboxScripts = `
        <div id="lightbox" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.8); justify-content:center; align-items:center; z-index:9999;">
          <img id="lightbox-img" src="" style="max-width:90%; max-height:90%; border-radius:10px;" />
        </div>
      `;
    }

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

    container.innerHTML = galleryHTML + infoHTML + lightboxScripts;

    // Nu virker klik
    const images = container.querySelectorAll("img[data-full]");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    images.forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.dataset.full;
        lightbox.style.display = "flex";
      });
    });

    lightbox.addEventListener("click", () => {
      lightbox.style.display = "none";
    });
  } catch (error) {
    console.error("Fejl:", error);
    container.innerHTML = "<p>❌ Kunne ikke hente holdoplysninger.</p>";
  }
});
