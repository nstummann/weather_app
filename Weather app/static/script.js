document.addEventListener('DOMContentLoaded', function() {

    function add_event_listeners() {
        const search_button = document.getElementById("search_button");
        search_button.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent the default form submission behavior
            q = document.getElementById("search_input").value;
            update_location(q);
            fetch_realtime(q);
            fetch_forecast(q);
        });
    }

    function update_location(q) {
        document.getElementById("location").innerHTML = q;
    }

    function format_hour(hour) {
        if (hour == 0) {
            return 12 + "am";
        } else if (hour < 10) {
            return "0" + hour + "am";
        } else if (hour >= 10 && hour < 12) {
            return hour + "am";
        } else if (hour == 12) {
            return hour + "pm";
        } else if (hour > 12 && hour < 22) {
            return "0" + (hour - 12) + "pm"; // Parentheses added for correct calculation
        } else {
            return (hour - 12) + "pm"; // Parentheses added for correct calculation
        }
    }

    function fetch_realtime(q) {
        fetch("/realtime?q=" + q)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                var tempC = data["temp_c"];
                document.getElementById("realtime_temp_c").innerHTML = tempC + "°C";
            })
            .catch(error => console.error("Error:", error));
    }

    function fetch_forecast(q) {
        fetch("/forecast?q=" + q)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                var hourColumn = document.getElementById("hour_column");
                hourColumn.innerHTML = "";

                data.forEach(item => {
                    var listItem = document.createElement("div");
                    hourColumn.appendChild(listItem);

                    var listItemTime = document.createElement("p");
                    listItemTime.textContent = format_hour(new Date(item["time"]).getHours());
                    listItem.appendChild(listItemTime);

                    var listItemIcon = document.createElement("span");
                    listItemIcon.innerHTML = "&#9729;";
                    listItem.appendChild(listItemIcon);

                    var listItemTemp = document.createElement("p");
                    listItemTemp.textContent = item["temp_c"] + "°";
                    listItem.appendChild(listItemTemp);
                });
            })
            .catch(error => console.error("Error:", error));
    }

    add_event_listeners();
});
