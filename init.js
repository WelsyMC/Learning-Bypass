
let lastUrl = location.href;

const checkUrlChange = () => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(handleUrlChange, 1000);
    }
};

function handleUrlChange() {
    tryToStart();
}

function tryToStart() {
    document.addEventListener("keyup", (ev) => {
        if (ev.key === "F9") {
            if (document.getElementById("modal-change-time")) return;

            const modal = document.createElement("div");

            modal.id = "modal-change-time";

            modal.innerHTML = `
                <div class="modal-wrapper">
                    <p class="text-xl font-bold w-full text-center">Ajout de temps</p>
                    <p class="font-medium my-2">Bienvenue dans l'utilitaire d'ajout de temps. <br />Vous avez la flemme de devoir faire 42h d'anglais ? Bah c'est réglé...</p>
    
                    <p class="mb-0 font-semibold">Entrez le nombre de <u>minutes à ajouter</u> dans le champ ci-dessous:</p>
                    <input type="number" placeholder="Nombre de minutes à ajouter" class="mb-3 block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500">
    
                    <button class="w-full rounded bg-green-600 py-2 text-white hover:bg-green-500">
                        Gagner du temps par-ce que flemme...
                    </button>
                </div>
            `;
            modal.querySelector("button").onclick = () => {
                const toAdd = modal.querySelector("input").value;

                if (!toAdd) {
                    return;
                }

                if (isNaN(parseInt(toAdd))) {
                    return;
                }

                const number = parseInt(toAdd);
                if (number < 0) {
                    return;
                }

                const regex = /module-page\/(\d+)\?sectionID=(\d+)&currentPathwayID=(\d+)/;
                const matches = window.location.toString().match(regex);

                if(!matches){
                    alert("Vous devez être dans un module pour effectuer l'ajout d'heures.");
                    return;
                }

                const moduleId = matches[1];
                const sectionID = matches[2];
                const currentPathwayID = matches[3];

                console.log("moduleId", moduleId, "sectionID", sectionID, "currentPathwayID", currentPathwayID);
                addTimeAndRefreshPage(number, 61839, currentPathwayID, sectionID, moduleId);
            }
            document.body.append(modal);
        }
    });
}

function addTimeAndRefreshPage(durationMinutes, activityID, learningPathwayID, learningPathwaySectionID, moduleID) {
    const token = localStorage.getItem("token");
    console.log("before date calculations")
    const endDate = new Date();
    const newDate = new Date(endDate);
    newDate.setMinutes(endDate.getMinutes() - durationMinutes);

    console.log("startDate:", newDate.toLocaleString("fr-FR"));
    console.log("endDate:", endDate.toLocaleString("fr-FR"));


    console.log("fetching");
    fetch("https://api.ops.eflexlanguages.com/api/save-draft", {
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "authorization": `Bearer ${token}`,
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referer": "https://limayrac.new.eflexlanguages.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "POST",
        "body": `{\"activityID\":${activityID},\"answers\":{},\"startTime\":\"${newDate.toISOString()}\",\"endTime\":\"${endDate.toISOString()}\",\"trainer\":null,\"trainerIDs\":null,\"timeSpent\":${durationMinutes * 60},\"learningPathwayID\":\"${learningPathwayID}\",\"learningPathwaySectionID\":\"${learningPathwaySectionID}\",\"moduleID\":\"${moduleID}\"}`
    }).then(r => r.json()).then(r => {
        if (r.success) {
            window.location.reload();
            return;
        } else {
            console.log(JSON.stringify(r));
        }
    });
}

setInterval(checkUrlChange, 150);
tryToStart();