
window.addEventListener('DOMContentLoaded', () => {

    loadUrbanAreas();
    attachScores();

});

let newScoresChart = () => {
    return new CanvasJS.Chart("scores-chart", {

        animationEnabled: true,
    
        axisX:{
            interval: 1
        },
        axisY2:{
            interlacedColor: "rgba(31, 134, 65,.1)",
            gridColor: "rgba(1,77,101,.1)",
            title: "Score out of 10"
        },
        data: [{
            type: "bar",
            name: "scores",
            axisYType: "secondary",
            color: "rgb(16, 100, 44)",
            dataPoints: []
        }]
    })
}

let ua_selector = document.getElementById("ua_selector");
let scores_chart = newScoresChart();

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

        scores_chart.destroy()
        scores_chart = newScoresChart();

        let api_URL = event.target.value.concat("scores/")

        let response = await fetch(api_URL);
        let data = await response.json();

        let categories = data["categories"];

        categories.forEach(category => {
            scores_chart.options.data[0].dataPoints.unshift({y: category.score_out_of_10, label: category.name})
        });

        scores_chart.render();
    });
}