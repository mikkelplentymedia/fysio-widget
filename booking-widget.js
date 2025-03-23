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
      const otherImages = pictures.slice(1, 3); // 2 ekstra

      galleryHTML += `
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; padding: 0 64px 32px 64px;">
          <div style="overflow: hidden; border-radius: 8px;">
            <img src="${firstImage}" alt="Galleri billede" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; cursor: pointer;" onclick="openLightbox('${firstImage}')" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${otherImages
              .map(
                (img) => `
              <div style="overflow: hidden; border-radius: 8px;">
                <img src="${img.url}" alt="Galleri billede" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; cursor: pointer;" onclick="openLightbox('${img.url}')" />
              </div>
            `
              )
              .join("")}
          </div>
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

    const lightboxHTML = `
      <div id="lightbox" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
        <img id="lightbox-img" src="" style="max-width:90%; max-height:90%; border-radius:8px;" />
        <span onclick="closeLightbox()" style="position:absolute; top:20px; right:30px; color:white; font-size:2em; cursor:pointer;">&times;</span>
      </div>
    `;

    container.innerHTML = galleryHTML + infoHTML + lightboxHTML;
  } catch (error) {
    console.error("Fejl:", error);
    container.innerHTML = "<p>❌ Kunne ikke hente holdoplysninger.</p>";
  }
});

// Lightbox-funktioner
window.openLightbox = function (imgUrl) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.src = imgUrl;
  lightbox.style.display = "flex";
};

window.closeLightbox = function () {
  document.getElementById("lightbox").style.display = "none";
};
