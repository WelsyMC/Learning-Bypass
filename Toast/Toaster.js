class Toaster {

    toasts = [];
    
    injectToPage(){
        if(document.getElementById("eflex-toast-container")){
            document.getElementById("eflex-toast-container").remove();
        }

        const div = document.createElement("div");
        div.id = "eflex-toast-container";

        document.body.appendChild(div);
    }

    info(title, message){
        const randomId = generateRandomNumber(200000, 1000000);
        
        this.toasts.push({
            "id": randomId,
            "title": title,
            "message": message,
            "createdAt": Date.now()
        });

        const alert = document.createElement("div");
        alert.classList.add("eflex-toast");
        alert.classList.add("info");
        alert.innerHTML = `<p>${title}</p><p>${message}</p>`;
        alert.onclick = () => {
            alert.remove();
            this.toasts = this.toasts.filter(toast => toast.id !== randomId); 
        };

        //document.getElementById("eflex-toast-container").append(alert);
    }

    warn(title, message){
        const randomId = generateRandomNumber(200000, 1000000);
        
        this.toasts.push({
            "id": randomId,
            "title": title,
            "message": message,
            "createdAt": Date.now()
        });


        const alert = document.createElement("div");
        alert.classList.add("eflex-toast");
        alert.classList.add("warn");
        alert.innerHTML = `<p>${title}</p><p>${message}</p>`;
        alert.onclick = () => {
            alert.remove();
            this.toasts = this.toasts.filter(toast => toast.id !== randomId); 
        };

       // document.getElementById("eflex-toast-container").append(alert);
    }
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
