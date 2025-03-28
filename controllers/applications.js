import express, { application } from "express";
import { Router } from "express";
const router = Router();
import User from "../models/user.js";

router.get("/", async (req, res)=> {
    try {
        const currentUser = await User.findById(req.session.user._id);
        res.render('applications/index.ejs', {
            applications: currentUser.applications,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

router.get("/new", async (req, res) => {
    try {
    res.render("applications/new.ejs", {user: req.session.user});
    } catch (error){
        console.log(error);
    }
})

router.post("/", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.applications.push(req.body);
        await currentUser.save();
        res.redirect("/users/"+ req.session.user._id +"/applications");
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

router.get("/:applicationId", async (req,res) => {
try{
const currentUser = await User.findById(req.session.user._id);
const application = await currentUser.applications.id(req.params.applicationId);
res.render("applications/show.ejs", {
    application: application,
})
} catch (error){
    console.log(error);
    res.redirect("/");
}
})

router.delete("/:applicationId", async (req,res) => {
    try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.applications.id(req.params.applicationId).deleteOne();
    await currentUser.save();
    res.redirect("/")
    } catch (error){
        console.log(error);
        res.redirect("/");
    }
})

router.get("/:applicationId/edit", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const application = currentUser.applications.id(req.params.applicationId);
        res.render("applications/edit.ejs", {
            application: application,
        });
    } catch (error){
        console.log(error);
        res.redirect("/");
    }
})

router.put("/:applicationId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const application = currentUser.applications.id(req.params.applicationId);
        application.set(req.body);
        await currentUser.save();
        res.redirect(`${req.params.applicationId}`);
    } catch (error){
        console.log(error)
        res.redirect("/");
    }
})

export default router;