const API_URL = "http://127.0.0.1:5000"; //후에 ec2 ip로 변경경
const reqButton = document.getElementById('sendRequest');
const tbody = document.querySelector('#news-container table tbody');
function newsTable(data){

    tbody.innerHTML = '';

    data.forEach(news => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${news["기사 제목"]}</td>
            <td>${news["뉴스 채널"]}</td>
            <td><a href="${news["기사 링크"]} target=_blank">기사 보기</a></td>
        `;
        tbody.appendChild(row);
    });
}

function sendRequest() {
    const ticker = document.getElementById('ticker').value;
    const year = document.getElementById('year').value;
    const queryString = new URLSearchParams({ ticker, year }).toString();
    const url = `${API_URL}/chart?${queryString}`;

    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
    },
    document.getElementById('loading-message').style.display = 'block'
    )
    .then(response => {

        if (!response.ok) {
            throw new Error("서버 응답 오류");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('loading-message').style.display = 'none';
        Plotly.newPlot('target-element', data.fig.data, data.fig.layout);
        return data.news;
    })
    .then(news => {
        const data = JSON.parse(news);
        newsTable(data);

    })
    .catch(error => {
        console.error("요청 실패:", error);
    });
}

reqButton.addEventListener('click', sendRequest);