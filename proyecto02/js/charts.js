
window.addEventListener('DOMContentLoaded', () => {

    loadUrbanAreas();
    //attachScores();

});

let ua_selector = document.getElementById("ua_selector");

loadUrbanAreas = async () => {

    let local_URL = "http://localhost:3000/api.local/urban_areas.json";

    let response = await fetch(local_URL);
    let data = await response.json();

    let u_areas = data["_links"]["ua:item"];

    u_areas.forEach(u_area => {
        ua_selector.innerHTML += 
        `
        <option value="${u_area.href}">${u_area.name}</option>
        `
    });
}

attachScores = () => {

    ua_selector.addEventListener("change", async (event) => {

        let api_URL = event.target.value.concat("scores/")

        let response = await fetch(api_URL);
        let data = await response.json();

        let categories = data["categories"];

        let score_table = document.getElementById("score_table");
        score_table.innerHTML = 
        `
        <tr>
            <th>Category</th>
            <th>Score out of 10</th>
        </tr>
        `
        categories.forEach(category => {
            score_table.innerHTML += 
            `
            <tr>
                <td align="right" style="border-color: white;">${category.name}</td>
                <td style="border-color: ${category.color};">${category.score_out_of_10}</td>
            </tr>
            `
        });
    });
}