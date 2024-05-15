//window.onload = getUserID(email);

document.addEventListener('DOMContentLoaded', () => {
    let dataList = [];
    const results = document.getElementById("results");
    const para = document.querySelector("#view");

    const dropdown = document.getElementById('Type');

    dropdown.addEventListener('change', function() {
        let selectedValue = dropdown.value;
        
        fetch(`https://funding-requests-management-dfae31570a7e.herokuapp.com/funds`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            dataList = data;
            para.innerHTML = ""; 
            results.innerHTML = "";
            
            for (let i = 0; i < data.length; i++) {
                let type = data[i].type;

                if(selectedValue === "All" ||selectedValue === type){
                    let name = data[i].name;
                    let suitable = data[i].suitable;
                    let list = document.createElement('li');
                    list.classList.add("list-item");
                    list.addEventListener('click', () =>{
                        para.innerHTML = `<h2><strong>${data[i].name}</strong></h2> <br>
                            <b>Fund summary</b>: ${data[i].summary}<br>
                            Suitable applicants: <b>${data[i].suitable}</b><br>
                            Deadline for fund application: <b>${data[i].deadline}</b><br>
                            Possible funding an applicant can expect to receive: <b>R${data[i].applicantFund}</b>`
    
                    });
                    
                    list.textContent = `${name} : ${suitable}`
                    results.appendChild(list);
                }
                
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    });
});
