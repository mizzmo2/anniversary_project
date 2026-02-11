
// UI is used to update the UI separately from Main and Utilities.
// Called by Main.

export function updateReadingList(docs = []) {
  if (!Array.isArray(docs)) return;

  const ul = document.getElementById("reading_list");
  if (!ul) return;

  ul.innerHTML = "";

  docs.forEach(doc => {
    const li = document.createElement("li");

    // Title
    const title = document.createElement("h3");
    title.textContent = doc.title ?? "Untitled";
    title.classList.add("list-heading-text");
    li.appendChild(title);

    // Author
    const author = document.createElement("p");
    author.textContent = `by ${doc.author ?? "Unknown"}`;
    author.classList.add("list-text");
    li.appendChild(author);

    // Metadata line
    const meta = document.createElement("small");
    meta.classList.add("list-text");

    const addedDate =
      doc.added instanceof Date
        ? doc.added
        : doc.added?.toDate?.();

    const dateText = addedDate
      ? addedDate.toLocaleDateString()
      : "unknown date";

    meta.textContent = `Added ${dateText} by ${doc.who ?? "unknown"}`;
    li.appendChild(meta);

    ul.appendChild(li);
  });
}

export function updateCurrentReading(docs = []){
  if (!Array.isArray(docs)) return;

  const p1 = document.getElementById("current_reading_1");
  const p2 = document.getElementById("current_reading_2");
  // Check both elements are present
  if(!p1 || !p2) return;

  p1.innerHTML = "No Current Reading Found for Mimi :(";
  p2.innerHTML = "No Current Reading Found for Toby :(";

  docs.forEach(doc => {
    const div = document.createElement("div");

    // Title
    const title = document.createElement("h3");
    title.classList.add("review-heading-text");
    // Set as Untitled if missing title
    title.textContent = doc.title ?? "Untitled";
    div.appendChild(title);
    // Author
    const author = document.createElement("h4");
    author.classList.add("review-author-text");
    author.textContent = `by ${doc.author ?? "Unknown"}`;
    div.appendChild(author);

    // Review
    const review = document.createElement("p");
    review.textContent = doc.review ?? "No Review";
    review.classList.add("review-body-text");
    div.appendChild(review);

     // Rating
    const rating = document.createElement("h4");
    rating.classList.add("review-body-text");
    rating.textContent = `Rating: ${doc.rating ?? "??"}/10`;
    div.appendChild(rating);

    const meta = document.createElement("small");
    meta.classList.add("review-meta-text");

    const addedDate =
      doc.added instanceof Date
        ? doc.added
        : doc.added?.toDate?.();

    const dateText = addedDate
      ? addedDate.toLocaleDateString()
      : "unknown date";

    meta.textContent = `Added ${dateText} by ${doc.who ?? "unknown"}`;
    div.appendChild(meta);

    if(doc.who == "toby" || doc.who == "Toby"){
      p2.innerHTML = "";
      p2.appendChild(div);
    }
    else if (doc.who == "mimi" || doc.who == "Mimi"){
      p1.innerHTML = "";
      p1.appendChild(div);
    }
  });

}

export function updateReadingTimeline(docs = []) {
  if (!Array.isArray(docs)) return;

  const ul = document.getElementById("timeline_list");
  if (!ul) return;

  ul.innerHTML = "";

  docs.forEach(doc => {
    const li = document.createElement("li");

    // Title
    const title = document.createElement("h3");
    title.textContent = doc.title ?? "Untitled";
    title.classList.add("list-heading-text");
    li.appendChild(title);

    // Author
    const author = document.createElement("p");
    author.textContent = `by ${doc.author ?? "Unknown"}`;
    author.classList.add("list-text");
    li.appendChild(author);

    // Rating
    const rating = document.createElement("p");
    rating.textContent = `Rating: ${doc.rating ?? "??"}/10`;
    rating.classList.add("list-text");
    li.appendChild(rating);

    // Metadata line
    const meta = document.createElement("small");
    meta.classList.add("list-text");

    const addedDate =
      doc.added instanceof Date
        ? doc.added
        : doc.added?.toDate?.();

    const dateText = addedDate
      ? addedDate.toLocaleDateString()
      : "(date broke)";

    const archivedDate = 
      doc.archivedAt instanceof Date
        ? doc.archivedAt
        : doc.archivedAt?.toDate?.();

    const archivedText = archivedDate
      ? archivedDate.toLocaleDateString()
      : "(date broke)";

    meta.textContent = `Started ${dateText} by ${doc.who ?? "unknown"}. Completed ${archivedText}.`;
    li.appendChild(meta);

    ul.appendChild(li);
  });
  
}

export function updateAllWants(docs = []){
  if (!Array.isArray(docs)) return;

  const ol = document.getElementById("wants_list");
  if (!ol) {
    console.error("wants_list element not found!");
    return;
  }

  if (docs.length === 0) {
    console.warn("No documents to display");
    ol.innerHTML = '<li>No wants found</li>';
    return;
  }

  ol.innerHTML = "";

  docs.forEach(doc => {
    const li = document.createElement("li");

    // Name
    const name = document.createElement("h3");
    name.textContent = doc.name ?? "No Name";
    name.classList.add("wotw-list-header");
    li.appendChild(name);

    // Link
    const link = document.createElement("a");
    link.textContent = `Link: ${doc.link ?? "No Link"}`;
    link.classList.add("wotw-content");
    link.href = `${doc.link ?? "google.com"}`;
    li.appendChild(link);

    // Metadata line
    const meta = document.createElement("small");
    meta.classList.add("wotw-content");

    const addedDate =
      doc.added instanceof Date
        ? doc.added
        : doc.added?.toDate?.();

    const dateText = addedDate
      ? addedDate.toLocaleDateString()
      : "unknown date";

    meta.textContent = `Added ${dateText} by ${doc.who ?? "unknown"}`;
    li.appendChild(meta);

    ol.appendChild(li);
  });
}

export function updateIndividualWants(docs = []){
  console.log("UI.js")
  if (!Array.isArray(docs)) return;

  const p1 = document.getElementById("mimi_want");
  const p2 = document.getElementById("toby_want");
  // Check both elements are present
  if(!p1 || !p2) return;

  p1.innerHTML = "No WOTW Found for Mimi :(";
  p2.innerHTML = "No WOTW Found for Toby :(";
  
  docs.forEach(doc => {
    const div = document.createElement("div");

    // Name
    const name = document.createElement("h3");
    name.classList.add("wotw-list-header-i");
    name.textContent = doc.name ?? "Untitled";
    div.appendChild(name);
    
    // Link
    const link = document.createElement("a");
    link.classList.add("wotw-content-i");
    link.textContent = `Link: ${doc.link ?? "Unknown Link"}`;
    link.href = doc.link;
    div.appendChild(link);

    const meta = document.createElement("small");
    meta.classList.add("wotw-content-i");

    const addedDate =
      doc.added instanceof Date
        ? doc.added
        : doc.added?.toDate?.();

    const dateText = addedDate
      ? addedDate.toLocaleDateString()
      : "unknown date";

    meta.textContent = `Added ${dateText} by ${doc.who ?? "unknown"}`;
    div.appendChild(meta);

    if(doc.who == "toby" || doc.who == "Toby"){
      p2.innerHTML = "";
      p2.appendChild(div);
    }
    else if (doc.who == "mimi" || doc.who == "Mimi"){
      p1.innerHTML = "";
      p1.appendChild(div);
    }
  });

}

export function updateChipRankings(docs = []) {

  const mimi_ranks = document.getElementById("mimi_rankings");
  const toby_ranks = document.getElementById("toby_rankings");

  mimi_ranks.innerHTML = "";
  toby_ranks.innerHTML = "";

  docs.forEach(doc => {
    if (!doc.ranks) return;
    doc.ranks.forEach(chip => {
      const li = document.createElement("li");
      li.textContent = chip ?? "Something Went Wrong :(";
      li.dataset.id = chip;
      li.classList.add("chip-rankings");

      if (doc.id === "toby") {
        toby_ranks.append(li);
      } else if (doc.id === "mimi") {
        mimi_ranks.append(li);
      }
    });
  });
}


export function calcPodium(docs = []) {

  const rankings = {};

  // Build a map of chip -> [positions]
  docs.forEach(doc => {
    if (!Array.isArray(doc.ranks)) return;

    doc.ranks.forEach((chip, index) => {

      if (!rankings[chip]) {
        rankings[chip] = [];
      }

      rankings[chip].push(index);
    });
  });

  // Calculate averages
  const averaged = Object.entries(rankings).map(([chip, positions]) => {

    const avg =
      positions.reduce((sum, pos) => sum + pos, 0) / positions.length;

    return { chip, avg };
  });

  // Sort by lowest average (best rank)
  averaged.sort((a, b) => a.avg - b.avg);

  // Get top 3
  const topThree = averaged.slice(0, 3);

  const winners = document.getElementById('winners');

  if (topThree[0]) winners.children[0].textContent = topThree[0].chip + ` (${topThree[0].avg + 1})`;
  if (topThree[1]) winners.children[1].textContent = topThree[1].chip + ` (${topThree[1].avg + 1})`;
  if (topThree[2]) winners.children[2].textContent = topThree[2].chip + ` (${topThree[2].avg + 1})`;
}
