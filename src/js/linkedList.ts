class LLNode {
    data : any;
    previous : LLNode | null;
    next : LLNode | null;
    constructor(data : any){
        this.data = data;
        this.previous = null;
        this.next = null;
    }
}

class DoubleLinkedList{
    head : LLNode | null;
    constructor(){
        this.head = null;
    }
    add(data:any) {
        const newNode = new LLNode(data);
        newNode.next = this.head;
        if(this.head !== null){
            this.head.previous = newNode;
        }
        this.head = newNode; 
    }
    remove(index : number){
        
    }
}