
$(document).ready(function () {

    var previousPage;
    var currentData;
    var searchTerm;


    resizeWindows()

    $(window).resize(function () {
        resizeWindows()
    })

    function resizeWindows() {
        var screenWidth = $(window).width();
        if (screenWidth >= 545) {
            $("#bodyDiv").css("left", "30%")
        }
        else if (screenWidth < 768) {
            $("#bodyDiv").css("left", "12%")
        }
    }



    $(document).on("click", "#leftDiv", function () {
        if (previousPage == "toStartPage") {
            toStartPage()
            previousPage = `toStartPage`
        }
        else if (previousPage == "startBtn") {
            startBtn()
            previousPage = "toStartPage"
        }
        else if (previousPage == "destinatonPrint") {
            destinationPrint()
            previousPage = `startBtn`
        }
        else if (previousPage == "departurePrint") {
            departurePrint(searchTerm)
            previousPage = `destinatonPrint`
        }
        else if (previousPage == "listPrint") {
            destinationPrint()
            previousPage = `startBtn`
        }
        else if (previousPage == "checkPost") {
            checkBtn()
            previousPage = `startBtn`
        }

    })


    $(document).on("click", "#checkPostBtn", function () {
        checkPostBtn()
        previousPage = "checkPost"
        // console.log(previousPage)
    })

    $(document).on("click", "#checkRideBtn", function () {
        checkRideBtn()
        previousPage = "checkPost"
        // console.log(previousPage)
    })



    //open menu
    $(document).on("click", "#mobileButton", function () {
        mobileClick()
    })

    //on click of getStarted button
    $(document).on("click", "#startBtn", function () {
        startBtn()
        previousPage = `toStartPage`
    })
    $(document).on("click", "#toStart", function () {
        mobileClick()
        toStartPage()
        previousPage = `toStartPage`
    })

    $(document).on("click", "#joinBtn", function () {
        destinationPrint()
        previousPage = `startBtn`
    })

    $(document).on("click", "#getRide", function () {
        mobileClick()
        destinationPrint()
        previousPage = `startBtn`
    })

    $(document).on("click", "#checkBtn", function () {
        checkBtn()
        previousPage = `startBtn`
    })

    $(document).on("click", "#postBtn", function () {
        postBtn()
        previousPage = `startBtn`
    })

    $(document).on("click", "#postRide", function () {
        mobileClick()
        postBtn()
        previousPage = `startBtn`
    })

    $(document).on("click", "#toCheck", function () {
        mobileClick()
        checkBtn()
        previousPage = `startBtn`
    })

    $(document).on("click", ".postInput", function () {
        $(this).val("");
    })

    $(document).on("click", "#postBtnInside", function () {

        var data = {
            name: $("#postName").val(),
            pin: $("#postPin").val(),
            phone: $("#postPhone").val(),
            departure: $("#postDeparture").val().toUpperCase(),
            destination: $("#postDestination").val().toUpperCase(),
            date: $("#postDate").val(),
            time: $("#postTime").find(":selected").text(),
            currentSeats: 0,
            seats: $("#postSeats").find(":selected").text(),
            minMoney: $("#postCost").val()
        }
        console.log(`data is...`)
        console.log(data)

        $.ajax({
            url: "/api/postRide",
            type: 'POST',
            data: data
        }).then(function (data) {
            $("#printDiv").empty()
            $("#dispTxt").text(`Posting Completed`)
            var doneTxt =
                `
                <button id="goBackBtn">Back to Start</button>
            `
            $("#printDiv").append(doneTxt)
        })
    })

    $(document).on("click", "#goBackBtn", function () {
        toStartPage();
        previousPage = `toStartPage`
    })

    $(document).on("click", "#goCheckBackBtn", function () {
        checkPostBtn()
        previousPage = `toStartPage`
    })



    $(document).on("click", ".selectBtn", function () {
        var targetId = $(this).attr("id")
        toJoinPage(targetId)
    })


    $(document).on("click", ".destination", function () {
        searchTerm = $(this).text();
        departurePrint(searchTerm)
        previousPage = `destinatonPrint`
    })

    $(document).on("click", ".departure", function () {
        var departure = $(this).text()
        listPrint(currentData, departure)
        previousPage = `listPrint`
    })

    $(document).on("click", "#joinBtnInside", function () {
        var targetId = $(this).attr("target")
        var data = {
            name: $("#joinName").val(),
            pin: $("#joinPin").val(),
            phone: $("#joinPhone").val(),
            email: $("#joinEmail").val(),
            memo: $("#joinMemo").val(),
            postid: targetId,
            isAccepted:true
        }
        console.log(data)

        $.ajax({
            url: "/api/joinRide",
            type: 'POST',
            data: data
        }).then(function (data) {
            $.get("/api/ids/" + targetId, function (data) {
                console.log(`updating target id:${data[0].id}`);
                var addSeat = data[0].currentSeats + 1
                console.log(`new seat is ${addSeat}`)
                var updatedSeat = {
                    id: data[0].id,
                    currentSeats: addSeat
                };

                if (addSeat >= data[0].seats) {
                    console.log("Seat reached max seat");
                    var targetBtn = `#` + targetId;
                    console.log(targetBtn)
                    $(targetBtn).attr("value", "disabled")
                }

                console.log(updatedSeat);

                $.ajax({
                    method: "PUT",
                    url: "/api/update",
                    data: updatedSeat,
                    success: function (response) {
                        if (response.success) {
                            console.log(`Joined!`)
                        }
                        else {
                            console.log(`Seat is full! Please refresh the page.`)
                        }
                    }
                })

            }).then(function (data) {
                $("#printDiv").empty()
                $("#dispTxt").text(`Request completed`)
                var doneTxt =
                    `
                <button id="goBackBtn">Back to Start</button>
            `
                $("#printDiv").append(doneTxt)
                targetId = "";
            })
        })
    })

    function toJoinPage(targetId) {

        console.log(`target id: ${targetId}`)
        $("#bodyDiv").empty();

        var joinDiv =
            `
                <div id="dispDiv">
                    <p id="dispTxt">Post Ride</p>
                        <div id="printDiv">
                            <div id="postDiv">
                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Name</span>
                                    </p>

                                    <p>
                                        <input type="text" value="John Doe" id="joinName" class="postInput">
                                    </p>                                    
                                </div>

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">PIN(4 digit) </span>
                                    </p>

                                    <p>
                                        <input type="password" maxlength="4" value="****" id="joinPin" class="postInput">
                                    </p>                                    
                                </div>                             

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Phone </span>
                                    </p>

                                    <p>
                                        <input type="text" value="000-000-0000" id="joinPhone" class="postInput">
                                    </p>                                    
                                </div>                               

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Email </span>
                                    </p>

                                    <p>
                                        <input type="text" value="JohnDoe@gmail.com" id="joinEmail" class="postInput">
                                    </p>                                    
                                </div>

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Memo</span>
                                    </p>

                                    <p>
                                        <input value="Memo" id="joinMemo" class="postInput"></input>
                                    </p>                                    
                                </div>

                                <button class="formBtn" target="${targetId}" id="joinBtnInside">Join</button>
                                

                            </div>
                        </div>                
                </div>
            `

        $("#bodyDiv").append(joinDiv)


    }

    function mobileClick() {

        if ($("#blackout").css("display") == "none") {
            $("#blackout").css("display", "block")
        }
        else {
            $("#blackout").css("display", "none")
        }
    }

    function toStartPage() {
        $("#bodyDiv").empty()
        var html =
            `            
        <button id="startBtn">
            <p>Get</p>
            <p>Started</p>
        </button>
        `

        $("#bodyDiv").append(html)
    }

    function startBtn() {
        $("#bodyDiv").empty() //clean up bodyDiv

        var Btn = `      
                    <button id="postBtn">
                    Post Ride
                    </button>

                    <button id="joinBtn">
                    Join Ride
                    </button>

                    <button id="checkBtn">
                    Check Ride
                    </button>
                `
        $("#bodyDiv").append(Btn)
    }

    function postBtn() {
        $("#bodyDiv").empty();

        var postDiv =
            `
                <div id="dispDiv">
                    <p id="dispTxt">Post Ride</p>
                        <div id="printDiv">
                            <div id="postDiv">
                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Name</span>
                                    </p>

                                    <p>
                                        <input type="text" value="John Doe" id="postName" class="postInput">
                                    </p>                                    
                                </div>

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Date</span>
                                    </p>

                                    <p>
                                        <input type="text" value="2018-02-09" id="postDate" class="postInput">
                                    </p>                                    
                                </div>

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">PIN(4 digit) </span>
                                    </p>

                                    <p>
                                        <input type="password" maxlength="4" value="****" id="postPin" class="postInput">
                                    </p>                                    
                                </div>
                                
                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Phone</span>
                                    </p>

                                    <p>
                                        <input type="text" value="000-000-0000" id="postPhone" class="postInput">
                                    </p>                                    
                                </div>                                   

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Time</span>
                                    </p>

                                    <p>
                                        <select id="postTime" class="postInputSelect"
                                            <option>06:00~08:00</option>
                                            <option>08:00~10:00</option>
                                            <option>10:00~12:00</option>
                                            <option>12:00~14:00</option>
                                            <option>14:00~16:00</option>
                                            <option>16:00~18:00</option>
                                            <option>18:00~20:00</option>
                                            <option>20:00~22:00</option>
                                            <option>22:00~24:00</option>
                                        </select>  
                                    </p>                                    
                                </div>                            

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Departure </span>
                                    </p>

                                    <p>
                                        <input type="text" value="Irvine" id="postDeparture" class="postInput">
                                    </p>                                    
                                </div>

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Max. Seats</span>
                                    </p>

                                    <p>
                                        <select id="postSeats" class="postInputSelect">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                            <option>6</option>
                                            <option>7</option>
                                        </select>
                                    </p>                                    
                                </div>

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Destination </span>
                                    </p>

                                    <p>
                                        <input type="text" value="UCSD" id="postDestination" class="postInput">
                                    </p>                                    
                                </div>

                                <div class="postItem">
                                    <p>
                                        <span class="postTxt">Cost($)</span>
                                    </p>

                                    <p>
                                        <input type="text" value="15" id="postCost" class="postInput">
                                    </p>                                    
                                </div>

                                <button class="formBtn" id="postBtnInside">Post</button>
                                


                            </div>
                        </div>                
                </div>
            `

        $("#bodyDiv").append(postDiv)
    }

    function destinationPrint() {
        $("#bodyDiv").empty();

        $.ajax({
            url: '/api/all/',
            type: 'GET'
        }).then(function (data) {
            console.log(data)
            var departureTxt = `<div id="departureTxt">`
            var array = []
            for (var i = 0, n = data.length; i < n; i++) {
                var flag = true;
                for (var j = 0; j < array.length; j++) {
                    if (data[i].destination == array[j]) {
                        flag = false;
                    }
                }
                if (flag) {
                    array.push(data[i].destination)
                    departureTxt += `<h3 class="destination">${data[i].destination}</h3>`;
                    console.log(`array is ${array}`)
                }
            }

            departureTxt += `</div>`

            var departureDiv =
                `
                <div id="dispDiv">
                    <p id="dispTxt">Available Destination School:</p>
                    <div id="printDiv">
                        ${departureTxt}
                    </div>
                </div>
            `

            $("#bodyDiv").append(departureDiv)

        });
    }
    function departurePrint(searchTerm) {
        $("#bodyDiv").empty();

        $.ajax({
            url: `/api/all/${searchTerm}`,
            type: 'GET'
        }).then(function (data) {
            // console.log(data)
            currentData = data;
            console.log(`current data is`)
            console.log(currentData)
            var departureTxt = `<div id="departureTxt">`
            var array = []
            for (var i = 0, n = data.length; i < n; i++) {
                var flag = true;
                for (var j = 0; j < array.length; j++) {
                    if (data[i].departure == array[j]) {
                        flag = false;
                    }
                }
                if (flag) {
                    array.push(data[i].departure)
                    departureTxt += `<h3 class="departure">${data[i].departure}</h3>`;
                    console.log(`array is ${array}`)
                }
            }

            departureTxt += `</div>`

            var departureDiv =
                `
                <div id="dispDiv">
                    <p id="dispTxt">Available Departure location:</p>
                    <p id="destinationTxt">${data[0].destination}</p>
                    <div id="printDiv">
                        ${departureTxt}
                    </div>
                </div>
            `
            $("#bodyDiv").append(departureDiv)
            searchTerm = "";
        })
    }

    function listPrint(currentData, departure) {
        // console.log(currentData)
        $("#dispTxt").text("Availalable Options for:")
        $("#printDiv").empty()
        $("#destinationTxt").text(`To: ${currentData[0].destination} from: ${departure}`)

        var dataText = `<div id="dataTxt">`

        for (var i = 0, n = currentData.length; i < n; i++) {
            if (currentData[i].departure == departure) {
                console.log(`searching for ${currentData[i].departure}`)
                var fullBtn = ``;
                var btnTxt = `Select`
                if (currentData[i].isFull) {
                    fullBtn = `disabled style="background-color:grey"`
                    btnTxt = `Full`
                }

                dataText += `
                <div class="wrapDiv">
                    <p>Name: ${currentData[i].name}</p>
                    <p>Date: ${currentData[i].date}</p>
                    <p>Time: ${currentData[i].time}</p>
                    <p>Seat: ${currentData[i].currentSeats} / ${currentData[i].seats}</p>
                    <p>
                        <button class="selectBtn" ${fullBtn} id="${currentData[i].id}">${btnTxt}</button>
                    </p>
                </div>
                `
            }
        }

        $("#printDiv").append(dataText)

        currentData = {}
        console.log(currentData)
    }


    function checkBtn() {
        $("#bodyDiv").empty() //clean up bodyDiv

        var Btn = `      
                    <button id="checkPostBtn">
                    Check Post
                    </button>

                    <button id="checkRideBtn">
                    Check Ride
                    </button>
                `
        $("#bodyDiv").append(Btn)
    }

    function checkPostBtn() {
        $("#bodyDiv").empty()
        var postDiv =
            `
            <div id="dispDiv">
                <p id="dispTxt">Check Post</p>
                    <div id="printDiv">
                        <div id="postDiv">
                            <div class="postItem">
                                <p>
                                    <span class="Txt">Name</span>
                                </p>

                                <p>
                                    <input type="text" value="John Doe" id="checkPostName" class="postInput">
                                </p>                                    
                            </div>

                            <div class="postItem">
                                <p>
                                    <span class="postTxt">PIN</span>
                                </p>

                                <p>
                                    <input type="password" maxlength="4" value="****" id="checkPostPin" class="postInput">
                                </p>                                    
                            </div>

                            
                            <button class="formBtn" id="checkPostBtnInside">Submit</button>
                           


                        </div>
                    </div>                
            </div>
        `

        $("#bodyDiv").append(postDiv)
    }
    $(document).on("click", "#checkPostBtnInside", function () {
        var info = {
            name: $("#checkPostName").val(),
            pin: $("#checkPostPin").val()
        }

        $.ajax({
            url: '/api/check/post',
            type: 'POST',
            data: info
        }).then(function (data) {
            console.log(data)
            checkPostDisplay(data)
        })

    })

    function checkPostDisplay(data) {
        $("#bodyDiv").empty();

        var postDiv =
            `
                <div id="dispDiv">
                    <p id="dispTxt">Post Status</p>
                    <div id="printDiv">
                    </div>
                </div>
            `
        $("#bodyDiv").append(postDiv)

        if (data.length == 0) {
            console.log(`no data found`)

            var doneTxt =
                `
            <div id="checkTxt">
            <span>No post/user found under this input Please check again or come back later</span>
            </div>
                      
            `
            $("#printDiv").append(doneTxt)

        }
        else {
            console.log(`data found`)
            console.log(data.length)

            var dataText = `<div id="dataTxt">`

            for (var i = 0, n = data.length; i < n; i++) {
                var fullBtn = ``;
                var btnTxt = `Select`
                if (data[i].isFull) {
                    fullBtn = `disabled style="background-color:grey"`
                    btnTxt = `Full`
                }
                dataText +=
                    `
                    <div class="wrapDiv">
                    <p>Name: ${data[i].name}</p>
                    <p>Phone: ${data[i].phone}</p>
                    <p>Email: ${data[i].email}</p>
                    <p>Memo: ${data[i].memo}</p>
                    </div>
                `
                // future update for accept/decline
                // <p>
                // <button id="${data[i].id}" class="chooseBtn">Accept</button>
                // <button id="${data[i].id}" class="chooseBtn">Decline</button>
                // </p>
            }

            dataText += `</div>`

            $("#printDiv").append(dataText)
        }



    }

    // $(document).on("click",".chooseBtn",function(){
    //     var update = {
    //         isAccepted:$(this).text(),
    //         id: $(this).attr("id")
    //     }
    //     console.log(update)

    //     $.ajax({
    //         method: "PUT",
    //         url: "/api/isAccepted/update",
    //         data: update
    //     }).then(function(data){
    //         console.log(data)
    //     })
    // })

    function checkRideBtn() {
        $("#bodyDiv").empty()
        var postDiv =
            `
            <div id="dispDiv">
                <p id="dispTxt">Check your ride</p>
                    <div id="printDiv">
                        <div id="postDiv">
                            <div class="postItem">
                                <p>
                                    <span class="Txt">Name</span>
                                </p>

                                <p>
                                    <input type="text" value="John Doe" id="checkJoinName" class="postInput">
                                </p>                                    
                            </div>

                            <div class="postItem">
                                <p>
                                    <span class="postTxt">PIN</span>
                                </p>

                                <p>
                                    <input type="password" maxlength="4" value="****" id="checkJoinPin" class="postInput">
                                </p>                                    
                            </div>

                            
                            <button class="formBtn" id="checkRideBtnInside">Submit</button>
                           


                        </div>
                    </div>                
            </div>
        `

        $("#bodyDiv").append(postDiv)
    }
    $(document).on("click", "#checkRideBtnInside", function () {
        var info = {
            name: $("#checkJoinName").val(),
            pin: $("#checkJoinPin").val()
        }
        $("#bodyDiv").empty();

        var postDiv =
            `
            <div id="dispDiv">
                <p id="dispTxt">Ride status</p>
                <div id="printDiv">
                    <div id="dataTxt">
                    </div>
                </div>
            </div>
        `
        $("#bodyDiv").append(postDiv)

        $.ajax({
            url: '/api/check/join',
            type: 'POST',
            data: info
        }).then(function (data) {
            if (data.length == 0) {
                console.log(`no data found`)

                var doneTxt =
                    `
                <div id="checkTxt">
                <span>No rides/user found under this input Please check again.</span>
                </div>
                          
                `
                $("#printDiv").append(doneTxt)

            }
            else {

                for (var i = 0, n = data.length; i < n; i++) {
                    var target = data[i].postid;
                    $.get(`/api/ids/${target}`, function (data) {

                        $("#dataTxt").append(
                            `
                                <div class="wrapDiv">
                                <p>Name: ${data[0].name}</p>
                                <p>Destination: ${data[0].destination}</p>
                                <p>Departure: ${data[0].departure}</p>
                                <p>Date: ${data[0].date}</p>
                                <p>Time: ${data[0].time}</p>
                                <p>Cost ($): ${data[0].minMoney}</p>
                                <p>Seats: ${data[0].currentSeats} / ${data[0].seats}</p>
                                </div>
                            `
                        )

                    })
                }

            }
        })
    })



})