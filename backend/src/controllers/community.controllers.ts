import { Request, Response } from "express";
// import { validationResult } from 'express-validator';
import { Community, CommunityTypes } from "../models/community.model";
import jwt from "jsonwebtoken";
// import { ApiError } from "../utility/apiError";

// import { tryCatch } from "../utility/tryCatch";
import { uploadOnCloudinary } from "../utility/cloudinary";
import User from "../models/user.model";
import { Post } from "../models/post.model";

interface decodedTypes {
  userId?: string;
}

// CREATE_COMMUNITY

const createCommunity = async (req: Request, res: Response) => {
  try {
    const { name: communityName, description } = req.body;
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(403).json({ error: "cookie missing" });

    // throw new ApiError("cookie missing", COM_COOKIE_MISSING, 403);
    // throw new Error('cookie missing')

    const refreshToken = cookies?.jwt;

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as decodedTypes;

    if (!decodedToken) {
      return res.status(401).json({ error: "Refresh Token Invalid" });
      // throw new ApiError("Refresh Token Invalid", COM_INVALID_RF_TOKEN, 401);
    }

    let foundCommunity = await Community.findOne({ communityName });
    let foundAuthor = await User.findById(decodedToken.userId);

    if (foundCommunity) {
      // throw new  Error('Community Already Exists')
      return res.status(403).json({ error: "Community Already Exists" });
      // throw new ApiError("Community Already Exists", COM_ALREADY_EXISTS, 403);
    }
    if (!foundAuthor) {
      // throw new Error('Author not found')
      return res.status(403).json({ error: "Author not found" });
      // throw new ApiError("Author not found", COM_AUTHOR_NOT_FOUND, 403);
    }

    const newCommunity = new Community({
      authorId: foundAuthor._id,
      authorName: foundAuthor.name,
      authorAvatar: foundAuthor.avatar,
      name: communityName,
      description,
      userId: foundAuthor._id,
      moderator: foundAuthor._id,
      members: foundAuthor._id,
    });
    await newCommunity.save();

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

// FIND_COMMUNITIES

const findCommunities = async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    const pageSize = 9;
    const skipItems = +page * 9;
    const foundCommunities = await Community.find()
      .skip(skipItems)
      .limit(pageSize)
      .sort();

    return res.status(200).send(foundCommunities);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getCommunity = async (req: Request, res: Response) => {
  try {
    const { comId } = req.params;

    const foundCommunity = await Community.findOne({ name: comId });

    if (!foundCommunity)
      return res.status(500).json({ error: "Community not found!" });
    // throw new ApiError("Community not found!", COM_NOT_FOUND, 404);

    return res.status(200).send(foundCommunity);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const joinCommunity = async (req: Request, res: Response) => {
  try {
    const { communityName, userId } = req.body;

    const community = await Community.findOneAndUpdate(
      {
        name: communityName,
      },
      {
        $push: {
          members: userId,
        },
      },
      {
        new: true,
      }
    );

    if (!community) return res.status(500).json({ error: "Not Joined" });
    // throw new ApiError("Not Joined", 907, 403);

    return res.status(200).json({ message: "done" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const leaveCommunity = async (req: Request, res: Response) => {
  try {
    const { communityName, userId } = req.body;

    const community = await Community.findOneAndUpdate(
      {
        name: communityName,
      },
      {
        $pull: {
          members: userId,
        },
      },
      {
        new: true,
      }
    );

    if (!community) return res.status(500).json({ error: "haven't left" });
    // throw new ApiError('haven"t left', 907, 403);

    return res.status(200).json({ message: "done" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getCommunities = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const foundCommunities = await Community.find(
      {
        members: {
          $in: [userId],
        },
        authorId: {
          $ne: userId,
        },
      },
      {
        name: 1,
        description: 1,
        avatarImg: 1,
        author: 1,
        _id: 1,
      }
    ).lean();

    // if(!foundCommunities)

    return res.status(200).send(foundCommunities);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getModCommunities = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const foundModCommunities = await Community.find(
      {
        authorId: userId,
      },
      {
        name: 1,
        description: 1,
        avatarImg: 1,
        author: 1,
        _id: 1,
      }
    );

    return res.status(200).send(foundModCommunities);
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

// type coverImgType =
interface uploadFile {
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
  // add other properties as needed
}

const editCommunity = async (req: Request, res: Response) => {
  try {
    const { name: newName, description, rules, communityName } = req.body;
    console.log(newName, description, rules, communityName);
    const foundCommunity = await Community.findOne({ name: communityName });

    if (!foundCommunity) {
      return res.status(404).json({ error: "Community Not Found" });
    }

    if (req.userId !== foundCommunity.authorId.toString()) {
      return res
        .status(403)
        .json({ error: "User not allowed to edit community" });
    }

    const imgFiles = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    // console.log(imgFiles);
    if (imgFiles.avatarImg && imgFiles.avatarImg[0]) {
      console.log("IMAGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
      const url = await uploadOnCloudinary(imgFiles.avatarImg[0]);
      if (!url) {
        return res.status(500).json({ error: "Error Uploading Avatar Image" });
      }
      foundCommunity.avatarImg = url;
    }

    if (imgFiles.coverImg && imgFiles.coverImg[0]) {
      console.log(
        "IMAGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE2222222222222222222222"
      );
      const url = await uploadOnCloudinary(imgFiles.coverImg[0]);
      if (!url) {
        return res.status(500).json({ error: "Error Uploading Cover Image" });
      }
      foundCommunity.coverImg = url;
    }

    const splittedRulesArr = rules.split(",").map((rule: any) => rule.trim());

    foundCommunity.name = newName;
    foundCommunity.rules = splittedRulesArr;
    foundCommunity.description = description;

    await foundCommunity.save();

    return res.status(200).json({ message: "Edit successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { communityName } = req.body;

    const foundCommunity = await Community.findOne({ name: communityName });

    if (foundCommunity?.authorId.toString() !== userId)
      return res.status(403).json({ error: "Invalid AC Token" });

    await Post.deleteMany({ communityId: foundCommunity._id });

    await Community.findOneAndDelete({
      name: communityName,
    });

    // if (!deletedCommunity)
    //   return new ApiError('Error Deleting Community', 911, 401);

    return res.status(200).json({ message: "Community Deleted!" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

export {
  createCommunity,
  editCommunity,
  getCommunities,
  findCommunities,
  getCommunity,
  joinCommunity,
  leaveCommunity,
  getModCommunities,
  deleteCommunity,
};
