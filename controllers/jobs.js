const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
  res.status(StatusCodes.OK).json({jobs, count:jobs.length})
}
const getSingleJob = async (req, res) => {
  const {
    user:{userId}, 
    params:{id:JobId}
  } = req
  const job = await Job.findOne({
    _id:JobId, 
    createdBy:userId
  })
  if(!job){
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({job})
}
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  console.log(job)
  res.status(StatusCodes.CREATED).json({job})
}
const updateJob = async (req, res) => {
  const {
    body:{company, position},
    user:{userId}, 
    params:{id:JobId}
  } = req
  const job = await Job.findByIdAndUpdate({_id:JobId, createdBy:userId}, req.body, {new:true, runValidators:true})
  if(company === '' || position === ''){
    throw new 
    BadRequestError(`Company or position fields cannot be empty`)
  }

  res.status(StatusCodes.OK).json({job})
}
const deleteJob = async (req, res) => {
  const {
    user:{userId}, 
    params:{id:JobId}
  } = req

  const job = await Job.findByIdAndRemove({_id:JobId, createdBy:userId}) 
  if(!job){
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).send()
}


module.exports = {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
}