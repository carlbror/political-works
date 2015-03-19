Template.reviewBox.helpers({
    getFamiliarity: function(){
        switch(this.familiarity){
            case 1:
                return "Briefly familiar";
            case 4:
                return "Read/watched it once";
            case 5:
                return "Read/watched it a few times";
            case 7:
                return "Know it by heart";
        }
    }
});