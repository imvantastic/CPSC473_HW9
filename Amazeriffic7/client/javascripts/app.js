var main = function(toDoObjects) {
    "use strict";
    console.log("SANITY CHECK");

    //put creation of todos in a viewModel
    var viewModel = function() {
        //save "this" because does not like bind
        var t = this;
        t.todoCollection = ko.observableArray([]);
        t.todoCollection = toDoObjects.map(function(toDo) {
            return {
                "description": toDo.description,
                "tags": toDo.tags
            };
        }); //.bind(t);

        $(".tabs a span").toArray().forEach(function(element) {
            var $element = $(element);

            // create a click handler for this element
            $element.on("click", function() {
                var $content,
                    $input,
                    $button,
                    i;

                $(".tabs a span").removeClass("active");
                $element.addClass("active");
                $("main .content").empty();

                //new tab
                if ($element.parent().is(":nth-child(1)")) {
                    $content = $("<ul>");
                    for (i = t.todoCollection.length - 1; i >= 0; i--) {
                        $content.append($("<li>").text(t.todoCollection[i].description));
                    }
                }
                //oldest tab
                else if ($element.parent().is(":nth-child(2)")) {
                    $content = $("<ul>");
                    t.todoCollection.forEach(function(todo) {
                        $content.append($("<li>").text(todo.description));
                    });
                }
                //tags tab
                else if ($element.parent().is(":nth-child(3)")) {
                    var tags = [];
                    t.todoCollection.forEach(function(toDo) {
                        toDo.tags.forEach(function(tag) {
                            if (tags.indexOf(tag) === -1) {
                                tags.push(tag);
                            }
                        });
                    });
                    console.log(tags);

                    var tagObjects = tags.map(function(tag) {
                        var toDosWithTag = [];

                        t.todoCollection.forEach(function(toDo) {
                            if (toDo.tags.indexOf(tag) !== -1) {
                                toDosWithTag.push(toDo.description);
                            }
                        });

                        return {
                            "name": tag,
                            "toDos": toDosWithTag
                        };
                    });

                    console.log(tagObjects);

                    tagObjects.forEach(function(tag) {
                        var $tagName = $("<h3>").text(tag.name),
                            $content = $("<ul>");


                        tag.toDos.forEach(function(description) {
                            var $li = $("<li>").text(description);
                            $content.append($li);
                        });

                        $("main .content").append($tagName);
                        $("main .content").append($content);
                    });

                }
                //add to do tab
                else if ($element.parent().is(":nth-child(4)")) {
                    var $input = $("<input>").addClass("description"),
                        $inputLabel = $("<p>").text("Description: "),
                        $tagInput = $("<input>").addClass("tags"),
                        $tagLabel = $("<p>").text("Tags: "),
                        $button = $("<span>").text("+");

                    $button.on("click", function() {
                        var description = $input.val(),
                            tags = $tagInput.val().split(","),
                            newToDo = {
                                "description": description,
                                "tags": tags
                            };

                        $.post("todos", newToDo, function(result) {
                            console.log(result);

                            // add toDos
                            t.todoCollection = toDoObjects.map(function(toDo) {
                                return {
                                    "description": toDo.description,
                                    "tags": toDo.tags
                                };
                            });

                            $input.val("");
                            $tagInput.val("");
                        });
                    });

                    $content = $("<div>").append($inputLabel)
                        .append($input)
                        .append($tagLabel)
                        .append($tagInput)
                        .append($button);
                }

                $("main .content").append($content);

                return false;
            });
        }); //.bind(t); 

        $(".tabs a:first-child span").trigger("click");

    };

    ko.applyBindings(new viewModel());

};

$(document).ready(function() {
    $.getJSON("todos.json", function(toDoObjects) {
        main(toDoObjects);
    });
});