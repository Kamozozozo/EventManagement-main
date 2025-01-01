export const adminAuth= (req,res)=>{
    res.status(200).json({ message: 'Welcome, Admin!' });
}
export const OrganizerAuth= (req,res)=>{
    res.status(200).json({ message: 'Welcome, Organizer!' });
}
export const  StudentAuth= (req,res)=>{
    res.status(200).json({ message: 'Welcome, Student' });
}