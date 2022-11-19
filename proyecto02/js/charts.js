
let jobsData = []

window.addEventListener('DOMContentLoaded', () => {

    let ua_selector = document.getElementById("ua_selector");
    let job_selector = document.getElementById("job_selector");

    let scores_chart = newScoresChart();
    let jobs_chart = newJobsChart();

    loadUrbanAreas();
    attachScores(ua_selector, scores_chart);
    attachJobs(ua_selector, job_selector, jobs_chart);

});

let newScoresChart = () => {
    return new CanvasJS.Chart("scores-chart", {

        animationEnabled: true,
        willReadFrequently: true,
        title:{
            text: "Scores Out Of Ten"
        },
        axisX:{
            interval: 1
        },
        axisY2:{
            interlacedColor: "rgba(31, 134, 65,.1)",
            gridColor: "rgba(1,77,101,.1)"
        },
        data: [{
            type: "bar",
            name: "scores",
            axisYType: "secondary",
            color: "rgb(16, 100, 44)",
            dataPoints: []
        }]
    });
}

let newJobsChart = () => {
    return new CanvasJS.Chart("jobs-chart", {
        animationEnabled: true,
        willReadFrequently: true,
        title:{
            text: "Jobs Salaries Per Year"
        },
        axisY :{
            valueFormatString: "#0,.",
            suffix: "k"
        },
        axisX: {
            title: "Percentiles"
        },
        toolTip: {
            shared: true
        },
        data: jobsData
    });
}

let loadUrbanAreas = async () => {

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

let attachScores = (ua_selector, scores_chart) => {

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

let attachJobs = (ua_selector, job_selector, jobs_chart) => {

    ua_selector.addEventListener("change", async (event) => {

        jobs_chart.destroy();
        jobsData = [];
        jobs_chart = newJobsChart();

        let api_URL = event.target.value.concat("salaries/")

        let response = await fetch(api_URL);
        let data = await response.json();

        let jobs = data["salaries"];
        job_selector.innerHTML = "<option disabled selected>Pick a job to display</option>";

        let percentiles = null;

        jobs.forEach(job => {

            percentiles = job["salary_percentiles"];

            job_selector.innerHTML += 
            `
            <option value='{"title":" ${job["job"].title}", "p_25": ${percentiles.percentile_25}, "p_50": ${percentiles.percentile_50}, "p_75": ${percentiles.percentile_75}}'>${job["job"].title}</option>
            `
        });

    });

    job_selector.addEventListener("change", (event) => {

        jobs_chart.destroy();

        let job = JSON.parse(event.target.value);

        let jobData = {        
            type: "stackedArea",
            showInLegend: true,
            name: `${job.title}`,
            dataPoints: [
            { x: 25, y: job.p_25 },
            { x: 50, y: job.p_50 },
            { x: 75, y: job.p_75 }
            ]
        }
        
        jobsData.push(jobData);

        jobs_chart = newJobsChart();
        jobs_chart.render();
    });

}