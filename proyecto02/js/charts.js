
let jobsData = []
let pickedJobs = []
let pickedJobsCards = []

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
            minimum: 0,
            valueFormatString: "$ #0,.",
            suffix: "k",
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

    let local_URL = "https://api.teleport.org/api/urban_areas/";

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

        document.getElementById("scores-chart").classList.remove("animate__flipInX");
        scores_chart.destroy()
        scores_chart = newScoresChart();
        document.getElementById("scores-chart").classList.add("animate__flipInX");

        let api_URL = event.target.value.concat("scores/")

        let response = await fetch(api_URL);
        let data = await response.json();

        let categories = data["categories"];

        categories.forEach(category => {
            scores_chart.options.data[0].dataPoints.unshift({y: category.score_out_of_10, label: category.name})
        });

        scores_chart.render();

        api_URL = event.target.value.concat("images/")

        response = await fetch(api_URL);
        data = await response.json();

        let image = data.photos[0].image.web;

        document.querySelector('body').style.cssText = 
        `
        background-image: url("${image}");
        background-repeat: no-repeat;
        background-size: contain;
        `;
    });
}

let attachJobs = (ua_selector, job_selector, jobs_chart) => {

    ua_selector.addEventListener("change", async (event) => {

        jobs_chart.destroy();
        jobsData = [];

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
            <option value='{"title":"${job["job"].title}", "p_25": ${percentiles.percentile_25}, "p_50": ${percentiles.percentile_50}, "p_75": ${percentiles.percentile_75}}'>${job["job"].title}</option>
            `

            if(pickedJobs.includes(job["job"].title)) {

                let jobData = {        
                    type: "stackedArea",
                    showInLegend: true,
                    name: `${job["job"].title}`,
                    dataPoints: [
                    { x: 25, y: percentiles.percentile_25 },
                    { x: 50, y: percentiles.percentile_50 },
                    { x: 75, y: percentiles.percentile_75 }
                    ]
                }
                
                jobsData.push(jobData);
            }
        });

        jobs_chart = newJobsChart();
        jobs_chart.render();

    });

    job_selector.addEventListener("change", (event) => {

        let job = JSON.parse(event.target.value);

        if (pickedJobs.includes(job.title)) return;
        if (pickedJobs.length === 4) {
            pickedJobs.shift();
            pickedJobsCards.shift().remove();
            jobsData.shift();
        }

        pickedJobs.push(job.title);

        let jobsDiv = document.getElementById("jobs-picked");
        const jobId = job.title.replace(/\s+/g, '');

        jobsDiv.insertAdjacentHTML('beforeend',
        `
        <div class="animate__animated animate__flipInY card picked-job col-auto">
            ${job.title}
            <span class="job-remove-button icon cross" id="${jobId}"></span>
        </div>
        `);
        let removeButton = document.getElementById(jobId);

        pickedJobsCards.push(removeButton.parentNode);

        removeButton.addEventListener("click", async (event) => {
            event.target.parentNode.classList.add("animate__zoomOut");

            const index = pickedJobs.indexOf(job.title);

            pickedJobs.splice(index, 1);
            jobsData.splice(index, 1);
            pickedJobsCards.splice(index, 1);

            jobs_chart.data = jobData;
            jobs_chart.render();

            await new Promise(r => setTimeout(r, 1000));
            event.target.parentNode.remove();
        });

        jobs_chart.destroy();

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