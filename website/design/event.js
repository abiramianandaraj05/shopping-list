

const supabase = createClient(supabaseUrl, supabaseKey)

const button = document.getElementById("submitButton");
const form = document.getElementById("Itemform");
const shoppingList = []

async function outputSoloData(){
    let items;
    const response = fetch("http://localhost:5000/Solo")
    .then(res => res.json())
    .then(data => {items = data.message;
        const length = items.length;
        displayData(length,items,true)
    })
    .catch(error => console.error('Fetch error:', error));
    
}

async function outputGroupData(){
    let items;
    const response = fetch("http://localhost:5000/Group")
    .then(res => res.json())
    .then(data => {items = data.message;
        const length = items.length;
        displayData(length,items,false)
    })
    .catch(error => console.error('Fetch error:', error));
    
}

async function ouputNotifyItems() {
    let items;
    const response = fetch("http://localhost:5000/ItemNotify")
    .then(res => res.json())
    .then(data => {items = data.message
        addNotice(items);
    })
    .catch(error => console.error('Fetch error:', error));
    
}

function addNotice(items){
    const startText = "The item ";
    const endText = " has been bought";
    const num = items.length;
    let string = "";
    const display = document.getElementById("notices");
    for(let i =0; i < num;i++)
    {
        string = startText + items[i].itemname + endText;
        const div = document.createElement("div");
        div.innerHTML = string;
        display.appendChild(div);
    }
}

function displayData(length,items,isSolo){
    let i = 0;
    let board;
    const select = document.getElementById("choice");
    if (isSolo == true){
    board = document.getElementById("Solo");
    }
    else{
        board = document.getElementById("Group");
    }
    for(i = 0; i<length;i++)
    {
        const div = document.createElement("div");
        const text = items[i].itemname;
        div.innerHTML = text;
        div.id = text;
        div.className = "list-text";
        
        if(isSolo == true)
            {
                div.addEventListener("click",removeSoloData);
            }
        else{
            div.addEventListener("click",removeGroupData);
            const option = document.createElement("option");
            option.value = text;
            option.innerHTML = text;
            select.appendChild(option);
        }
        div.addEventListener("mouseover",crossData);
        div.addEventListener("mouseout",unCrossData);
        board.appendChild(div);
    }
}

function crossData(){
    let element = event.target;
    element.className = "text-hover";
}

function unCrossData(){
    let element = event.target;
    element.className = "list-text";
}

function removeSoloData(){
    let element = event.target;
    element.className = "text-crossed"
    element.removeEventListener("mouseover",crossData);
    element.removeEventListener("mouseout",unCrossData);
    const response = fetch("http://localhost:5000/RemoveSolo",{
        method:"Post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({itemname:element.id})
        });

    
}

function removeGroupData(){
    let element = event.target;
    element.className = "text-crossed"
    element.removeEventListener("mouseover",crossData);
    element.removeEventListener("mouseout",unCrossData);
    const response = fetch("http://localhost:5000/RemoveGroup",{
        method:"Post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({itemname:element.id})
        });
}


await ouputNotifyItems();
await outputGroupData();
await outputSoloData();

