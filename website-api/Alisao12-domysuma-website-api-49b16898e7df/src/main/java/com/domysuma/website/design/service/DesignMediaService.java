package com.domysuma.website.design.service;

import com.domysuma.website.core.exception.APIException;
import com.domysuma.website.core.service.FileStorageService;
import com.domysuma.website.core.util.FileUtil;
import com.domysuma.website.design.data.dto.request.DesignMediaCreate;
import com.domysuma.website.design.data.mapper.DesignMediaMapper;
import com.domysuma.website.design.model.Design;
import com.domysuma.website.design.model.DesignMedia;
import com.domysuma.website.design.repository.DesignMediaRepo;
import com.domysuma.website.design.repository.DesignRepo;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DesignMediaService {
    private final static String FOLDER = "design/media/";

    private final DesignMediaRepo designMediaRepo;
    private final DesignRepo designRepo;

    private final FileStorageService fileStorageService;

    private final DesignMediaMapper designMediaMapper;

    public void createDesignMedia(Design design, Collection<DesignMediaCreate> mediaCreate) {
        if (mediaCreate == null || mediaCreate.isEmpty()) {
            return;
        }

        mediaCreate.forEach(media -> {

            var designMedia = designMediaMapper.toEntity(media);
            designMedia.setDesign(design);

            var file = FileUtil.base64ToMultipart(media.getEncodedFile());

            String extension = FilenameUtils.getExtension(file.getOriginalFilename());
            String fileName = FilenameUtils.removeExtension(file.getOriginalFilename());
            assert fileName != null;

            fileName = fileName.replaceAll("\\s+", "_").toLowerCase() + "_" + RandomStringUtils.randomAlphanumeric(16).toLowerCase();
            fileName = fileName.replaceAll("-", "_");
            String newFileName = fileName + "." + extension;
            String filePath = FOLDER + newFileName;

            designMedia.setPath(filePath);

            if (designMedia.getTitle() == null || designMedia.getTitle().equals("")) {
                designMedia.setTitle(fileName);
            }

            if (designMedia.getAlt() == null || designMedia.getAlt().equals("")) {
                designMedia.setAlt(fileName);
            }

            var newDesignMedia = designMediaRepo.save(designMedia);

            if (newDesignMedia.getIsDefault()) {
                setDesignDefaultImage(newDesignMedia);
            }

            try {
                fileStorageService.saveFile(file, filePath);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    public void addDesignMedia(Long designId, List<DesignMediaCreate> mediaCreate) {
        var design = designRepo.findById(designId).orElseThrow(() -> APIException.notFound("Design with ID: {0} not found.", designId));
        createDesignMedia(design, mediaCreate);
    }

    public void setDesignDefaultImage(DesignMedia designMedia) {
        var design = designMedia.getDesign();
        design.setDefaultImage(designMedia);
        designRepo.save(design);

        setDesignMediaIsDefaultStatus(design, designMedia);
    }

    public void setDesignMediaIsDefaultStatus(Design design, DesignMedia designMedia) {
        var designMedias = designMediaRepo.findAllByDesignAndIdNot(design, designMedia.getId());
        designMedia.setIsDefault(true);

        if (designMedias.size() > 0) {
            designMedias.forEach(media -> {
                media.setIsDefault(false);
            });
        }

        designMedias.add(designMedia);
        designMediaRepo.saveAll(designMedias);
    }

    public void makeDesignMediaDefault(Long designMediaId) {
        var designMedia = findDesignMediaByIdOrThrow(designMediaId);
        setDesignDefaultImage(designMedia);
    }

    public void removeDesignMedia(Long designMediaId) {
        var designMedia = findDesignMediaByIdOrThrow(designMediaId);

        if (designMedia.getIsDefault()) {
            throw APIException.badRequest("You cannot delete a default image. Set a different default image before deleting this one.");
        }
        designMediaRepo.delete(designMedia);
        fileStorageService.deleteFile(designMedia.getPath());
    }

    public DesignMedia findDesignMediaByIdOrThrow(Long designMediaId) {
        return designMediaRepo.findById(designMediaId).orElseThrow(() -> APIException.notFound("Design media with ID: {0} not found.", designMediaId));
    }
}
