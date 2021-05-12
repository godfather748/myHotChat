$(() => {
    let socket = io()
    // let icons = ["CA", "CAshield", "CM", "cyclops", "daredevil", "deadpool", "hulk", "hulkhand", "ironman", "magneto", "spidey", "stormbreaker", "thanos", "thor", "wolverine"]

    // function getRandomIcon() {
    //     return icons[Math.floor(Math.random() * 15)]
    // }

    // let iconMap = {}
    $('#letschat').show()
    $('.chatBox').hide()
    $('.chatBoxHeader').hide()
    $('#chatBoxFooter').hide()
    $('#crossIcon').hide()

    // window.currentUser = $('#inpUsername').val()

    if (!window.localStorage.id || window.localStorage.id == 0) {
        location.href = '/'
        return
    }
    console.log('helloji')
    if (window.localStorage.user) {
        socket.emit('login', {
            alreadyUser: window.localStorage.user
        })
    } else {
        socket.emit('login', {
            alreadyUser: null
        })
    }




    function onlinePeople(data) {
        $('#onlinePeople').empty()
        $('#onlinePeople').append($(`<li class="contact-link">
                                    <div class="d-flex bd-highlight">
                                        <div class="img_cont">
                                            <!-- class="img_cont" -->
                                            <img src="/icons/everyone.png" class="user_img">
                                            <!-- class="rounded-circle user_img" -->
                                            <!-- <span class="online_icon"></span> -->
                                        </div>
                                        <div class="user_info">
                                            <span>Everyone</span>
                                        </div>
                                        <div class="mr-3 ml-auto user_messages">
                                            <span class="px-2 py-1">0</span>
                                        </div>
                                    </div>
                                </li>`))
        for (let u of data.users) {
            // console.log(iconMap[u])
            if (u != window.currentUser && !$(`#onlinePeople li`).hasClass(`${u}`)) {
                // debugger;
                $('#onlinePeople').append($(`
                                            <li class="contact-link ${u}">
                                                <div class="d-flex bd-highlight">
                                                    <div class="img_cont">
                                                        <!-- class="img_cont" -->
                                                        <img src="/icons/${data.iconMap[u]}.png" class="user_img">
                                                        <!-- class="rounded-circle user_img" -->
                                                        <!-- <span class="online_icon"></span> -->
                                                    </div>
                                                    <div class="user_info">
                                                        <span>${u}</span>
                                                    </div>
                                                    <div class="mr-3 ml-auto user_messages">
                                                        <span class="px-2 py-1">0</span>
                                                    </div>
                                                </div>
                                            </li>
                                        `))
            }
        }
        $('#onlinePeople').append($(`<li class="contact-link leave">
                                    <div class="d-flex bd-highlight">
                                        <div class="img_cont">
                                            <!-- class="img_cont" -->
                                            <a href="/">
                                                <img src="/icons/leave.png" class="user_img">
                                            </a>
                                            <!-- class="rounded-circle user_img" -->
                                            <!-- <span class="online_icon"></span> -->
                                        </div>
                                        <div class="user_info">
                                            <a href="/">
                                                <span>Leave chat</span>
                                            </a>
                                        </div>
                                    </div>
                                </li>`))
    }

    function indiChatBox(user) {
        if (!$(`#chatBoxId div`).hasClass(`${user}`)) {
            console.log('yoyo')
            $(`<div class="${user} chatBox card-body msg_card_body"></div>`).insertBefore($('#chatBoxId #chatBoxFooter'))
            // $('#chatBoxId #chatBoxFooter').appendTo($('#chatBoxId .chatBox'))
            $(`#chatBoxId div.${user}`).hide()
        }
    }

    function newIndiChatBox(users) {
        for (let u of users) {
            $(`<div class="${u} chatBox card-body msg_card_body"></div>`).insertBefore($('#chatBoxId #chatBoxFooter'))
            $(`#chatBoxId div.${u}`).hide()
        }
    }

    let currentIcon

    socket.on('logged-in', async (data) => {
        // username = data.username
        // $('#letschat').show()
        // $('.chatBox').hide()
        // $('.chatBoxHeader').hide()
        // $('#chatBoxFooter').hide()
        // $('#crossIcon').hide()
        console.log('2')
        window.currentUser = data.user
        window.localStorage.id = 1
        window.localStorage.user = data.user
        currentIcon = data.iconMap[currentUser]
        socket.emit('new-logged-in', currentUser)
    })

    socket.on('yes-new-logged-in', async (data) => {
        console.log('4.1')
        await onlinePeople(data)
        await newIndiChatBox(data.users)
    })

    socket.on('yes-logged-in', async (data) => {
        console.log('4.2')
        await onlinePeople(data)
        if (data.user) {
            await indiChatBox(data.user)
        }
    })

    // // socket.on('login failed', () => {
    // //     window.alert('incorrect username or password')
    // //     console.error('pata nahi kya error hai')
    // // })



    $("#onlinePeople").on("click", "li", function (event) {
        if ($(this).hasClass('leave')) {
            // $('#loginBox').show()
            // $('#chatpage').hide()
            // $('#inpUsername').val('')
            // $('#inpPassword').val('')
            window.localStorage.id = 0
            window.localStorage.removeItem('user')
            socket.emit('userLeft', currentUser)
        } else {
            $('#onlinePeople .active').removeClass('active')
            $(this).addClass('active')
            $('#letschat').hide()
            $('.chatBox').hide()
            $(`.chatBox.${$('#onlinePeople .active .user_info span').text()}`).show()
            $('#chatBoxFooter').show()
            $('.chatBoxHeader').show()
            $(`.chatBoxHeader .img_cont img`).attr('src', `${$('#onlinePeople .active .img_cont img').attr('src')}`)
            $('.chatBoxHeader #user_info_name').text(`${$('#onlinePeople .active .user_info span').text()}`)
        }
    });

    // // $('#onlinePeople #leave').click(()=>{
    // //     $('#loginBox').show()
    // //     $('#chatpage').hide()
    // //     socket.emit('userLeft',currentUser)
    // // })



    $('#btnSend').click(() => {
        socket.emit('msg_send', {
            from: currentUser,
            to: $('#onlinePeople .active .user_info span').text(),
            message: $('#inpMessage').val()
        })
        $(`.chatBox.${$('#onlinePeople .active .user_info span').text()}`).append($(`<div class="d-flex justify-content-end mb-4">
                                    <div class="msg_cotainer_send">
                                        ${$('#inpMessage').val()}
                                    </div>
                                    <div class="img_cont_msg">
                                        <img src="/icons/${currentIcon}.png" class="rounded-circle user_img_msg">
                                    </div>
                                </div>`))
        $('#inpMessage').val('')
        $('#onlinePeople .active .user_messages span').text('0')
    })


    socket.on('msg_rcvd', (data) => {
        $(`.chatBox.${data.from}`).append($(`<div class="d-flex justify-content-start mb-4">
                                    <div class="img_cont_msg">
                                        <img src="/icons/${data.icon}.png"
                                            class="rounded-circle user_img_msg">
                                    </div>
                                    <div class="msg_cotainer">
                                        ${data.message}
                                    </div>
                                </div>`))
        $(`#onlinePeople .${data.from} .user_messages span`).text(`${parseInt($(`#onlinePeople .${data.from} .user_messages span`).text())+1}`)
    })


    $('#searchIcon').click(() => {
        if ($('#searchId').val()) {
            $('#searchIcon').hide()
            $('#crossIcon').show()
            $('#onlinePeople li').hide()
            $(`#onlinePeople .${$('#searchId').val()}`).show()
        } else {
            $('#onlinePeople li').show()
        }
    })

    $('#crossIcon').click(() => {
        $('#searchId').val('')
        $('#onlinePeople li').show()
        $('#searchIcon').show()
        $('#crossIcon').hide()
    })


    // socket.on('checkIfOnline', () => {
    //     console.log('hii')
    //     socket.emit('replyToCheck', {
    //         id: socket.id,
    //         user: currentUser
    //     })
    // })
})