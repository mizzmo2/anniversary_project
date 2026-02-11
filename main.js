// Imported Functions Here
import { updateReadingList, updateCurrentReading, updateReadingTimeline, updateAllWants, updateIndividualWants, updateChipRankings, calcPodium } from "./ui.js";
import { getReadingList, getCurrentReading, getTimeline, getAllWants, getWotw, getChipRankings, saveChipRankings,  } from "./firebase.js";
import { waitReadingList, waitCurrentReading, waitAddWant, waitAddChip, initializeImageViewer } from "./utility.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Detect Reading Page Body
    if(document.getElementById('reading_body')){
        // Update Reading List
        getReadingList(lists => {
            updateReadingList(lists);
        });
        // Update Current Reading
        getCurrentReading(lists => {
            updateCurrentReading(lists);
        })

        // Update Reading Timeline
        getTimeline(lists => {
            updateReadingTimeline(lists);
        })

        // ______ Reading List Form _____________________________________________________________________________________________________

        // Hide and Show the add to reading list form.
        const modal = document.getElementById("addBookModal");

        const addReadingBtn = document.getElementById("add_reading_list");
        if (addReadingBtn) {
            addReadingBtn.addEventListener("click", () => {
                modal.classList.remove("hidden");
            });
        }

        const addReadingListForm = document.getElementById("add_reading_list_form");
        const cancelBtn = document.getElementById("cancel_add_reading_list");

        // Cancel Button to hide form
        if(cancelBtn){
            cancelBtn.addEventListener("click", () => {
                addReadingListForm.reset();
                modal.classList.add("hidden");
            })
        }
        
        
        
        // Add to Reading List
        if(addReadingListForm){
            addReadingListForm.addEventListener("submit", async(e) => {
            e.preventDefault();
            const formData = new FormData(addReadingListForm);
            // Get fields from form
            const title = formData.get("title")?.trim();
            const author = formData.get("author")?.trim();
            const who = formData.get("who")?.trim();
            // Check filled

            if (!title || !author || !who) {
                alert("Please fill in all fields");
                return;
            }

            // Wait for submit to Firebase
            await waitReadingList(title, author, who);

            // Reset form and hide.
            addReadingListForm.reset();
            modal.classList.add("hidden");

            });
        }

        // ______ Current Reading Form _____________________________________________________________________________________________________

        // Hide and Show Current Reading Form
        const currentRModal = document.getElementById("addCurrentModal");

        const addCurrentForm = document.getElementById("add_current_reading_form");
        const cancelCurrentBtn = document.getElementById("cancel_add_current");

        const addCurrentBtn = document.getElementById("add_current_reading");
        if (addCurrentBtn) {
            addCurrentBtn.addEventListener("click", () => {
                currentRModal.classList.remove("hidden");
            });
        }

        // Cancel Button to hide form
        if(cancelCurrentBtn){
            cancelCurrentBtn.addEventListener("click", () => {
                addCurrentForm.reset();
                currentRModal.classList.add("hidden");
            })
        }
        
        // Add to Current Reading
        if (addCurrentForm){
            // Update Slider Text
            const slider = document.getElementById("rating_slider");
            const slider_text = document.getElementById("slider_text");
            slider_text.innerHTML = "Rating: " + slider.value + "/10";

            slider.oninput = function() {
                slider_text.innerHTML = "Rating: " + this.value + "/10";
            } 

            addCurrentForm.addEventListener("submit", async(e) => {
                e.preventDefault();
                const formData = new FormData(addCurrentForm);
                // Get fields
                const title = formData.get("title")?.trim();
                const author = formData.get("author")?.trim();
                const who = formData.get("who")?.trim();
                const review = formData.get("review")?.trim();
                const rating = formData.get("rating");

                if (!title || !author || !who || !review || !rating) {
                    alert("Please fill in all fields");
                    return;
                }

                // Wait for submit to Firebase
                await waitCurrentReading(title, author, who, review, rating);

                // Reset form and hide.
                addCurrentForm.reset();
                currentRModal.classList.add("hidden");
            })
        } 
    }
    if(document.getElementById('wotw_body')){
        // Update Want List
        getAllWants(lists => {
            updateAllWants(lists);
        });

        getWotw(lists => {
            updateIndividualWants(lists);
        })

        const modal = document.getElementById("addWantModal");

        const addWant = document.getElementById("add_want");
        if (addWant) {
            addWant.addEventListener("click", () => {
                modal.classList.remove("hidden");
            });
        }

        const wantForm = document.getElementById("add_wotw");
        const cancelBtn = document.getElementById("cancel_add_want");

        // Cancel Button to hide form
        if(cancelBtn){
            cancelBtn.addEventListener("click", () => {
                wantForm.reset();
                modal.classList.add("hidden");
            })
        }

        if(wantForm){
            wantForm.addEventListener("submit", async(e) => {
            e.preventDefault();
            const formData = new FormData(wantForm);
            // Get fields from form
            const want = formData.get("want")?.trim();
            const link = formData.get("link")?.trim() || "No Link";
            const who = formData.get("who")?.trim();
            // Check filled

            if (!want || !who) {
                alert("Please fill in all fields");
                return;
            }

            // Wait for submit to Firebase
            await waitAddWant(want, link, who);

            // Reset form and hide.
            wantForm.reset();
            modal.classList.add("hidden");

            });
        }

    }
    if(document.getElementById('chip_body')){

        getChipRankings(lists => {
            updateChipRankings(lists);
            calcPodium(lists);
        });
        

        const toby_list = document.getElementById('toby_rankings');
        const mimi_list = document.getElementById('mimi_rankings');

        Sortable.create(toby_list, {
            animation: 150,
            onEnd: async () => {
                const newOrder = Array.from(toby_list.children).map(li => li.dataset.id);
                console.log("New order:", newOrder);
                 await saveChipRankings("toby", newOrder);
            }
        });

        Sortable.create(mimi_list, {
            animation: 150,
            onEnd: async () => {
                const newOrder = Array.from(mimi_list.children).map(li => li.dataset.id);
                console.log("New order:", newOrder);
                await saveChipRankings("mimi", newOrder);
            }
        });

        const input = document.getElementById("new_chip_input");
        const button = document.getElementById("add_chip_btn");

        button.addEventListener("click", async () => {
            const chipName = input.value.trim();
            if (!chipName){
                alert("No name added!");
                return;
            }

            await waitAddChip(chipName);

            input.value = "";
        });
    }
    // Document Hoard
    if(document.getElementById('image_container')) {
        // Initialize the image viewer
        // Change "documents" to whatever folder path you're using in Firebase Storage
        await initializeImageViewer("images");
        
        console.log("Image viewer initialized");
    }
});





