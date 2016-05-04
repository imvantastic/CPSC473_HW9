var main = function() {
    "use strict";

    var CommentModel = function(comments) {
        this.comments = ko.observableArray(comments);
        this.commentToAdd = ko.observable("");
        this.addComment = function() {
            if (this.commentToAdd() != "") {
                // Adds the comments. Writing to the "comments" observableArray causes any associated UI to update.
                this.comments.push(this.commentToAdd());
                // Clears the text box, because it's bound to the "commentToAdd" observable
                this.commentToAdd("");
            }
        }.bind(this); // Ensure that "this" is always this view model
    };

    ko.applyBindings(new CommentModel(["This is the first comment!"]));
};

$(document).ready(main);