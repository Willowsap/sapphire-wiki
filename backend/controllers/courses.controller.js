const Course = require('../models/courses.model');

exports.updateCourse = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + 's://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const course = new Course({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Course.updateOne({_id: req.params.id, creator: req.userData.userId}, course).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: 'Update successful!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Couldn\'t update class!'
    });
  });
}

exports.addCourse = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const course = new Course({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  course.save().then(createdCourse => {
    res.status(201).json({
      message: 'Course posted successfully!',
      course: {
        ...createdCourse,
        id: createdCourse._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Creating a course failed"
    });
  });
}

exports.getCourses = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let courseQuery = null;
  if (req.query.userId) {
    courseQuery = Course.find({creator: req.query.userId});
  } else {
    courseQuery = Course.find();
  }
  let fetchedCourses;
  if (pageSize && currentPage) {
    courseQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  courseQuery.then(documents => {
    fetchedCourses = documents;
    return Course.count();
  }).then(count => {
    res.status(200).json({
      message: 'Courses fetched successfully!',
      courses: fetchedCourses,
      maxCourses: count
    })
  }).catch(error => {
    res.status(500).json({
      message: "Fetching Courses failed!"
    });
  });
}

exports.getCourse = (req, res, next) => {
  Course.findById(req.params.id).then(document => {
    if (document) {
      res.status(200).json({
        message: 'Course fetched successfully!',
        course: document
      });
    } else {
      res.status(404).json({message: 'Course not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching course failed!"
    });
  });
}

exports.deleteCourse = (req, res, next) => {
  Course.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion Successful!"});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Deletion failed!"
    });
  });
}